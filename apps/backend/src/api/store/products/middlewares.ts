import { NextFunction } from 'express'

import {
    MedusaRequest,
    MiddlewareRoute,
    maybeApplyLinkFilter
} from '@medusajs/framework'

import sellerProductLink from '../../../links/seller-product'

export const storeProductMiddlewares: MiddlewareRoute[] = [
    {
        methods: ['GET'],
        matcher: '/store/products',
        middlewares: [
            async (req: MedusaRequest, _, next: NextFunction) => {
                console.log('Middleware: Headers:', req.headers)
                console.log('Middleware: Query:', req.query)
                console.log('Middleware: URL:', req.url)

                // Initialize filterableFields if it doesn't exist
                if (!req.filterableFields) {
                    req.filterableFields = {}
                }

                // Apply seller_id filter directly
                if (req.headers.seller_id) {
                    req.filterableFields.seller_id = req.headers.seller_id
                    console.log('Middleware: Applied seller_id filter:', req.headers.seller_id)
                } else {
                    console.log('Middleware: No seller_id header found')
                }

                console.log('Middleware: Final filterableFields:', req.filterableFields)
                return next()
            },
            maybeApplyLinkFilter({
                entryPoint: sellerProductLink.entryPoint,
                resourceId: 'product_id',
                filterableField: 'seller_id'
            }),
            async (req: MedusaRequest, _, next: NextFunction) => {
                console.log('Middleware: After maybeApplyLinkFilter - filterableFields:', req.filterableFields)
                console.log('Middleware: After maybeApplyLinkFilter - URL:', req.url)
                return next()
            }
        ]
    },
    {
        methods: ['GET'],
        matcher: '/store/products/*',
        middlewares: [
            async (req: MedusaRequest, _, next: NextFunction) => {
                console.log('Middleware: Single Product - Headers:', req.headers)
                console.log('Middleware: Single Product - URL:', req.url)

                // For single product requests, we don't need seller filtering
                // as the product ID is already specified
                return next()
            }
        ]
    }
]