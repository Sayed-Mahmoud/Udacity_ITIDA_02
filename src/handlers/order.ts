import express, { Request, Response } from 'express'
import { Order, UserOrders } from '../models/order'
import jwt from 'jsonwebtoken'

const userOrder = new UserOrders()
const orderRoutes = express.Router()

const show = async (req: Request, res: Response) => {
  const userid: number = parseInt(req.params.userid)
  if (isNaN(userid)) {
    res.send('Please provide a valid User id!')
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

  const orders = await userOrder.show(userid)
  res.json(orders)
}

const showCompleted = async (req: Request, res: Response) => {
  const userid: number = parseInt(req.params.userid)
  if (isNaN(userid)) {
    res.send('Please provide a valid User id!')
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

  const orders = await userOrder.showCompleted(userid)
  res.json(orders)
}

const create = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userid as string)
  const productId = parseInt(req.query.productid as string)
  const quantity = parseInt(req.query.quantity as string)
  const status = req.query.status as string
  if (
    userId === undefined ||
    isNaN(userId) ||
    userId <= 0 ||
    productId === undefined ||
    isNaN(productId) ||
    productId <= 0 ||
    quantity === undefined ||
    isNaN(quantity) ||
    quantity <= 0 ||
    status === undefined ||
    status.length === 0 ||
    (status !== 'active' && status !== 'complete')
  ) {
    res.send('Please provide a valid Order details!')
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

  const order: Order = {
    user_id: userId,
    product_id: productId,
    quantity,
    status
  }
  try {
    const newOrder = await userOrder.create(order)
    res.json(newOrder)
  } catch (err) {
    res.status(400)
    res.json(`Error order create: ${err}`)
  }
}

const update = async (req: Request, res: Response) => {
    const id = parseInt(req.query.id as string)
    const status = req.query.status as string
    if (id === undefined || isNaN(id) ||
    status === undefined || status.length == 0 || (status != 'active' && status != 'complete')) {
        res.send(`Please provide a valid Order details!`)
        return;
    }

    const order: Order = {
        id: id,
        user_id: 0,
        product_id: 0,
        quantity: 0,
        status: status,
    }
    try {
        const updated = await userOrder.update(order)
        res.json(updated)
    } catch (err) {
        res.status(400)
        res.json(err as string + order)
    }
}

const destroy = async (req: Request, res: Response) => {
    const orderId: number = parseInt(req.body.id)
    if (isNaN(orderId)) {
        res.send(`Please provide a valid Order id!`)
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

    const deleted = await userOrder.delete(orderId)
    res.json(deleted)
}

orderRoutes.get('/orders/:userid', show)
orderRoutes.get('/orders/completed/:userid', showCompleted)
orderRoutes.post('/orders', create)
orderRoutes.put('/orders', update)
orderRoutes.delete('/orders', destroy)

export default orderRoutes
