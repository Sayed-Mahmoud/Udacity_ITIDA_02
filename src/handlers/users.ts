import express, { Request, Response } from 'express'
import { User, ApplicationUsers } from '../models/user'
import jwt from 'jsonwebtoken'

const appUser = new ApplicationUsers()
const userRoutes = express.Router()

const index = async (req: Request, res: Response) => {

  try {
    const authorizationHeader = req.headers.authorization as string
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET as string)
  } catch (err) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
  }

  const users = await appUser.index()
  res.json(users)
}

const show = async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.id)
  if (isNaN(userId)) {
    res.send('Please provide a valid User id!') //, query: ${req.query.id}, body: ${req.body.id}, params: ${req.params.id} ${userId}
    return
  }

  try {
    const authorizationHeader = req.headers.authorization as string
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET as string)
  } catch (err) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
  }

  const user = await appUser.show(userId)
  res.json(user)
}

const create = async (req: Request, res: Response) => {
  const fName = req.query.firstname as string
  const lName = req.query.lastname as string
  const pass = req.query.password as string
  if (
    fName === undefined ||
        fName.length < 2 ||
        lName === undefined ||
        lName.length < 2 ||
        pass === undefined ||
        pass.length < 6
  ) {
    res.send(
      'Please provide a valid User details! The password length must be 6 or greater'
    )
    return
  }

  try {
    const authorizationHeader = req.headers.authorization as string
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET as string)
  } catch (err) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
  }

  const user: User = {
    firstname: fName,
    lastname: lName,
    password: pass
  }
  try {
    const newUser = await appUser.create(user)
    const token = jwt.sign(
      { user: newUser },
            process.env.TOKEN_SECRET as string
    )
    res.json(token)
    // res.json(newUser)
  } catch (err) {
    res.status(400)
    res.json(`Error user create: ${err}`)
  }
}

const authenticate = async (req: Request, res: Response) => {
  const fName = req.query.firstname as string
  const lName = req.query.lastname as string
  const pass = req.query.password as string
  if (
    fName === undefined ||
        fName.length < 2 ||
        lName === undefined ||
        lName.length < 2 ||
        pass === undefined ||
        pass.length < 6
  ) {
    res.send(
      'Please provide a valid User details! The password length must be 6 or greater'
    )
    return
  }

  const user: User = {
    firstname: fName,
    lastname: lName,
    password: pass
  }
  try {
    const u = await appUser.authenticate(
      user.firstname,
      user.lastname,
      user.password
    )
    const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string)
    res.json(token)
  } catch (error) {
    res.status(401)
    res.json({ error })
    console.log(`user authenticate error: ${error}`)
  }
}

/*
const destroy = async (_req: Request, res: Response) => {
    const deleted = await appUser.delete(_req.body.id)
    res.json(deleted)
}

const update = async (req: Request, res: Response) => {
    const user: User = {
        id: parseInt(req.params.id),
        username: req.body.username,
        password: req.body.password,
    }
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string)
        if (decoded !== user.id?.toString()) {//decoded.id
            throw new Error('User id does not match!')
        }
    } catch (err) {
        res.status(401)
        res.json(err)
        return
    }

    try {
        const updated = await appUser.create(user)
        res.json(updated)
    } catch (err) {
        res.status(400)
        res.json(err as string + user)
    }
}
*/

userRoutes.get('/users', index)
userRoutes.get('/users/:id', show)
userRoutes.post('/users', create)
// userRoutes.delete('/users', destroy)
// userRoutes.put('/users', update)
userRoutes.post('/users/authenticate', authenticate)

export default userRoutes
