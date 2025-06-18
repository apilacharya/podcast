import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export const PORT = process.env.PORT
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY