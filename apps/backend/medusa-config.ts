import { defineConfig, loadEnv } from '@medusajs/framework/utils'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Validate needed environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'STORE_CORS',
  'ADMIN_CORS',
  'AUTH_CORS',]
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar] || process.env[envVar] === '' || process.env[envVar].startsWith("$")) {
    throw new Error(`Environment variable ${envVar} is required but not set: value is ${process.env[envVar] || 'undefined'}`)
  }
})

//Display the required environment variables
console.log(`Starting Medusa backend with the following environment variables:
  DATABASE_URL: ${process.env.DATABASE_URL}
  STORE_CORS: ${process.env.STORE_CORS}
  ADMIN_CORS: ${process.env.ADMIN_CORS}
  AUTH_CORS: ${process.env.AUTH_CORS}
  JWT_SECRET: ${process.env.JWT_SECRET || 'supersecret'}
  COOKIE_SECRET: ${process.env.COOKIE_SECRET || 'supersecret'}
`)
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret'
    }
  },
  modules: [
    { resolve: '@mercurjs/seller' },
    { resolve: '@mercurjs/reviews' },
    { resolve: '@mercurjs/marketplace' },
    { resolve: '@mercurjs/configuration' },
    { resolve: '@mercurjs/order-return-request' },
    { resolve: '@mercurjs/requests' },
    { resolve: '@mercurjs/brand' },
    { resolve: '@mercurjs/wishlist' },
    { resolve: '@mercurjs/split-order-payment' },
    { resolve: '@mercurjs/attribute' },
    {
      resolve: '@mercurjs/taxcode',
      options: {
        apiKey: process.env.STRIPE_SECRET_API_KEY
      }
    },
    { resolve: '@mercurjs/commission' },
    {
      resolve: '@mercurjs/payout',
      options: {
        apiKey: process.env.STRIPE_SECRET_API_KEY,
        webhookSecret: process.env.STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET
      }
    },
    {
      resolve: '@mercurjs/algolia',
      options: {
        apiKey: process.env.ALGOLIA_API_KEY,
        appId: process.env.ALGOLIA_APP_ID
      }
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: '@mercurjs/payment-stripe-connect',
            id: 'stripe-connect',
            options: {
              apiKey: process.env.STRIPE_SECRET_API_KEY
            }
          }
        ]
      }
    },
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: '@mercurjs/resend',
            id: 'resend',
            options: {
              channels: [],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL
            }
          },
          {
            resolve: '@medusajs/medusa/notification-local',
            id: 'local',
            options: {
              channels: ['feed', 'seller_feed', 'email']
            }
          }
        ]
      }
    }
  ]
})
