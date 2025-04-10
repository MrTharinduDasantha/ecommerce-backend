// MEDUSA_BACKEND_CORE_PATH should be used when customizing the Medusa Server instance
const MEDUSA_BACKEND_CORE_PATH = process.cwd()

// MEDUSA_ADMIN_BACKEND_CORE_PATH should be used when customizing the Medusa Admin
const MEDUSA_ADMIN_BACKEND_CORE_PATH = process.cwd()

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: process.env.DATABASE_URL,
    database_type: "mysql2",
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    jwt_secret: process.env.JWT_SECRET,
    cookie_secret: process.env.COOKIE_SECRET,
    database_extra: { ssl: { rejectUnauthorized: false } }
  },
  plugins: [],
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-local"
    },
    cacheService: {
      resolve: "@medusajs/cache-redis"
    }
  }
} 