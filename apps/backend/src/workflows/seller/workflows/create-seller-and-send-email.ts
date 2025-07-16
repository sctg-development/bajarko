import { Modules } from '@medusajs/framework/utils'
import {
    WorkflowResponse,
    createWorkflow,
    transform,
    createStep,
    StepResponse
} from '@medusajs/workflows-sdk'
import { setAuthAppMetadataStep } from '@medusajs/medusa/core-flows'

import { CreateMemberDTO, CreateSellerDTO } from '@mercurjs/framework'
import { ResendNotificationTemplates } from '@mercurjs/resend'

import { createMemberStep } from '../../member/steps'
import { createSellerOnboardingStep, createSellerStep } from '../steps'

type CreateSellerAndSendEmailWorkflowInput = {
    seller: CreateSellerDTO
    member: Omit<CreateMemberDTO, 'seller_id'>
    email: string
    password_reset_url: string
    auth_identity_id: string
}

type EmailNotificationData = {
    email: string
    user_name: string
    store_name: string
    reset_password_url: string
}

const sendSellerCreatedEmailStep = createStep(
    'send-seller-created-email',
    async (emailData: EmailNotificationData, { container }) => {
        const notificationService = container.resolve(Modules.NOTIFICATION)

        const notification = await notificationService.createNotifications({
            to: emailData.email,
            channel: 'email',
            template: ResendNotificationTemplates.SELLER_ACCOUNT_CREATED,
            content: {
                subject: `Welcome to Mercur - Your seller account "${emailData.store_name}" has been created`
            },
            data: {
                data: {
                    user_name: emailData.user_name,
                    store_name: emailData.store_name,
                    reset_password_url: emailData.reset_password_url
                }
            }
        })

        return new StepResponse(notification)
    }
)

export const createSellerAndSendEmailWorkflow = createWorkflow(
    'create-seller-and-send-email',
    function (input: CreateSellerAndSendEmailWorkflowInput) {
        const seller = createSellerStep(input.seller)

        const memberInput = transform(
            { seller, member: input.member },
            ({ member, seller }) => ({
                ...member,
                seller_id: seller.id
            })
        )

        const member = createMemberStep(memberInput)
        createSellerOnboardingStep(seller)

        // Link auth identity to member
        setAuthAppMetadataStep({
            authIdentityId: input.auth_identity_id,
            actorType: 'seller',
            value: member.id
        })

        // Prepare email data
        const emailData = transform(
            { input, seller },
            ({ input, seller }) => ({
                email: input.email,
                user_name: input.member.name,
                store_name: seller.name,
                reset_password_url: input.password_reset_url
            })
        )

        // Send email notification
        sendSellerCreatedEmailStep(emailData)

        return new WorkflowResponse({ seller, member })
    }
)
