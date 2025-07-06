import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'
import { Modules } from '@medusajs/framework/utils'

export const generatePasswordResetTokenStep = createStep(
    'generate-password-reset-token',
    async (input: { email: string }, { container }) => {
        const authService = container.resolve(Modules.AUTH)

        // Generate a proper reset password token using the auth service
        // This will automatically emit the AuthWorkflowEvents.PASSWORD_RESET event
        // which will be handled by the existing password reset subscriber
        const { token } = await authService.resetPassword('emailpass', {
            identifier: input.email
        })

        return new StepResponse({ token })
    }
)
