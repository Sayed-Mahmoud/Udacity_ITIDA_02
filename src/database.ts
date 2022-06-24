import dotenv from 'dotenv'
import { Pool } from 'pg'
// import { env } from 'process'

dotenv.config()

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV /*,
  BCRYPT_PASSWORD,
  SALT_ROUNDS
  */
} = process.env

let client: Pool
console.log(`ENV: ${ENV}`)

if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  })
} else if (ENV === 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  })
} else {
  client = new Pool()
  console.log(`Wrong ENV Value: ${ENV}`)
}

export default client
