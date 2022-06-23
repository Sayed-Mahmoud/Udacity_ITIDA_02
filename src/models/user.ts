import client from '../database'
import bcrypt from 'bcrypt'

const saltRounds = process.env.SALT_ROUNDS
const pepper = process.env.BCRYPT_PASSWORD

export type User = {
    id?: number
    firstname: string
    lastname: string
    password: string
}

export type UserDetail = {
    id?: number
    firstname: string
    lastname: string
}

export class ApplicationUsers {
  async index (): Promise<UserDetail[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT id, firstname, lastname FROM users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`cannot get users ${err}`)
    }
  }

  async show (id: number): Promise<UserDetail> {
    try {
      const sql =
                'SELECT id, firstname, lastname FROM users WHERE id=($1)'
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find User ${id}. Error: ${err}`)
    }
  }

  async create (user: User): Promise<User> {
    try {
      const sql =
                'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *'
      const conn = await client.connect()

      const hash = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds as string)
      )

      const result = await conn.query(sql, [
        user.firstname,
        user.lastname,
        hash
      ])

      const CreatedUser: User = result.rows[0]

      conn.release()

      return CreatedUser
    } catch (err) {
      console.log(
                `creating user error: ${err}, firstName: ${user.firstname}, lastName: ${user.lastname}, password: ${user.password}`
      )
      throw new Error(
                `Could not add new User ${user}. Error: ${err}, firstName: ${user.firstname}, lastName: ${user.lastname}, password: ${user.password}`
      )
    }
  }

  async authenticate (
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User | null> {
    const conn = await client.connect()
    const sql =
            'SELECT Password FROM users WHERE firstname=($1) AND lastname=($2)'

    const result = await conn.query(sql, [firstName, lastName])

    // console.log('password: ' + password + ', pepper' + pepper)

    if (result.rows.length) {
      const userPass = result.rows[0]

      if (bcrypt.compareSync(password + pepper, userPass.password)) {
        // console.log(`password compared, password: ${password}, pepper: ${pepper}, userPass: ${userPass.password}`)
        return userPass
      }
    }

    return null
  }

  async delete (id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)'
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const deletedCount = result.rowCount

      conn.release()

      return deletedCount
    } catch (err) {
      console.log(`deleting User error ${err}, id: ${id}`)
      throw new Error(`Could not delete User ${id}. Error: ${err}`)
    }
  }

  async clear (): Promise<number> {
    try {
      const sql = 'DELETE FROM users'
      const conn = await client.connect()

      const result = await conn.query(sql)

      const deletedCount = result.rowCount

      conn.release()

      return deletedCount
    } catch (err) {
      throw new Error(`Could not delete Users. Error: ${err}`)
    }
  }
}
