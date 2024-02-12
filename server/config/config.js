import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
  .option('--mode <mode>', 'select mode', 'production')

program.parse()

export const enviroment = program.opts().mode

dotenv.config({
  path: enviroment === 'production' ? './.env.production' : './.env.development'
})

export default {
  mongo: {
    url: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB_NAME
  },
  config: {
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    port: process.env.PORT,
    persistence: process.env.PERSISTENCE
  },
  strategy: {
    key: process.env.PRIVATE_KEY,
    cookieName: process.env.COOKIE_NAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    privateSession: process.env.PRIVATE_SESSION
  },
  email: {
    user: process.env.EMAIL_GMAIL,
    password: process.env.EMAIL_PASSWORD
  },
  stripe: {
    secretKey: process.env.SECRET_KEY
  }

}
