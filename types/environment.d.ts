/* eslint-disable no-unused-vars */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      MONGODB_URI_JEST: string
      CONNECTION_ATTEMPTS_LIMIT: number
      CONNECTION_ATTEMPTS_MS_TO_RETRY: number
      BCRYPT_SALT_ROUNDS: number
      PAGINATION_ITEMS_LIMIT: number
      JWT_SECRET: string
    }
  }
}

export { }
