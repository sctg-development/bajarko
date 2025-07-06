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
                if (req.headers.seller_id) {
                    req.filterableFields.seller_id = req.headers.seller_id
                }
                return next()
            },
            maybeApplyLinkFilter({
                entryPoint: sellerProductLink.entryPoint,
                resourceId: 'product_id',
                filterableField: 'seller_id'
            }),
            async (req: MedusaRequest, _, next: NextFunction) => {
                console.log(req.filterableFields)

                return next()
            }
        ]
    }
]