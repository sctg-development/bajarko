import { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys, AuthWorkflowEvents, Modules } from '@medusajs/framework/utils'
import { createSellerAndSendEmailWorkflow } from '../../../workflows/seller/workflows'
import { AdminCreateSellerType } from './validators'
import { buildResetPasswordUrl, Hosts } from '../../../shared/infra/http/utils/hosts'

/**
 * @oas [get] /admin/sellers
 * operationId: "AdminListSellers"
 * summary: "List Sellers"
 * description: "Retrieves a list of sellers."
 * x-authenticated: true
 * parameters:
 *   - name: offset
 *     in: query
 *     schema:
 *       type: number
 *     required: false
 *     description: The number of items to skip before starting to collect the result set.
 *   - name: limit
 *     in: query
 *     schema:
 *       type: number
 *     required: false
 *     description: The number of items to return.
 *   - name: fields
 *     in: query
 *     schema:
 *       type: string
 *     required: false
 *     description: Comma-separated fields to include in the response.
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             sellers:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/VendorSeller"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 * tags:
 *   - Admin Sellers
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: sellers, metadata } = await query.graph({
    entity: 'seller',
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination
  })

  res.json({
    sellers,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take
  })
}

/**
 * @oas [post] /admin/sellers
 * operationId: "AdminCreateSeller"
 * summary: "Create Seller"
 * description: "Creates a new seller account and sends a welcome email with password reset link."
 * x-authenticated: true
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *             description: The name of the seller store.
 *           email:
 *             type: string
 *             format: email
 *             description: The email address of the seller.
 *           member_name:
 *             type: string
 *             description: The name of the seller member.
 *           description:
 *             type: string
 *             description: A description of the seller.
 *           phone:
 *             type: string
 *             description: The phone number of the seller.
 *         required:
 *           - name
 *           - email
 *           - member_name
 * responses:
 *   "201":
 *     description: Seller created successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             seller:
 *               $ref: "#/components/schemas/AdminSeller"
 *             member:
 *               type: object
 *               description: The created member object.
 *   "400":
 *     description: Bad Request
 * tags:
 *   - Admin Sellers
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 */
export async function POST(
  req: MedusaRequest<AdminCreateSellerType>,
  res: MedusaResponse
): Promise<void> {
  const authService = req.scope.resolve(Modules.AUTH)

  // First, create an auth identity for the seller
  const { authIdentity } = await authService.register('emailpass', {
    body: {
      email: req.body.email,
      password: 'temporary-password-will-be-reset'
    }
  })

  if (!authIdentity) {
    throw new Error('Failed to create auth identity')
  }

  // Create seller and send welcome email with password reset link
  const { result } = await createSellerAndSendEmailWorkflow.run({
    container: req.scope,
    input: {
      seller: {
        name: req.body.name,
        email: req.body.email, // Add email to seller
        description: req.body.description
      },
      member: {
        name: req.body.member_name,
        email: req.body.email,
        phone: req.body.phone
      },
      email: req.body.email,
      password_reset_url: buildResetPasswordUrl(Hosts.VENDOR_PANEL).toString(),
      auth_identity_id: authIdentity.id
    }
  })

  res.status(201).json(result)
}
