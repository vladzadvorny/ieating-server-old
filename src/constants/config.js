import dotenv from 'dotenv'

// dotenv
dotenv.config({})

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = !isProduction

export const dbName = process.env.DB_NAME
export const dbUser = process.env.DB_USER
export const dbPassword = process.env.DB_PASSWORD
export const dbHost = process.env.DB_HOST
export const dbPort = process.env.DB_PORT

export const url = process.env.URL
export const port = process.env.PORT

export const jwtSecret = process.env.JWT_SECRET
export const jwtIssuer = process.env.JWT_ISSUER

export const destination = process.env.DESTINATION
export const uploadsRoute = process.env.UPLOADS_ROUTE
