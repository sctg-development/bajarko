import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'

import { ResendNotificationTemplates } from '@mercurjs/resend'
import { buildResetPasswordUrl, Hosts } from '../shared/infra/http/utils/hosts'

export default async function sellerPasswordResetHandler({
    event,
    container
}: SubscriberArgs<{ email: string; auth_identity_id: string }>) {
    const notificationService = container.resolve(Modules.NOTIFICATION)
    const authService = container.resolve(Modules.AUTH)

    try {
        // Generate a proper reset password token
        const { token } = await authService.resetPassword('emailpass', {
            identifier: event.data.email
        })

        if (token) {
            await notificationService.createNotifications({
                to: event.data.email,
                channel: 'email',
                template: ResendNotificationTemplates.FORGOT_PASSWORD,
                content: {
                    subject: 'Mercur - Set your password for your new seller account'
                },
                data: {
                    data: {
                        url: buildResetPasswordUrl(Hosts.VENDOR_PANEL, token).toString()
                    }
                }
            })
        }
    } catch (error) {
        console.error('Failed to send password reset email for new seller:', error)
    }
}

export const config: SubscriberConfig = {
    event: 'seller.password-reset-requested',
    context: {
        subscriberId: 'seller-password-reset-handler'
    }
}
