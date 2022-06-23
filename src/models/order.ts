import client from '../database'

export type Order = {
  id?: number
  user_id: number
  product_id: number
  quantity: number
  status: string
}

export type OrderDetails = {
  order_product_id: number
  order_id: number
  user_id: number
  product_id: number
  name: string
  category: string
  price: string
  quantity: number
  status: string
}

export class UserOrders {
  async show (userId: number): Promise<OrderDetails[]> {
    try {
      const sql =
        'SELECT order_products."id" AS "order_product_id", orders."id" AS order_id, orders.user_id, order_products.product_id, products."name", products.category, products.price, order_products.quantity, orders.status ' +
        'FROM public.orders ' +
        'INNER JOIN public.order_products ON ' +
        'order_products.order_id = orders."id" ' +
        'INNER JOIN public.products ON ' +
        'order_products.product_id = products."id" ' +
        'WHERE orders.user_id=($1)'
      const conn = await client.connect()

      const result = await conn.query(sql, [userId])

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not find order ${userId}. Error: ${err}`)
    }
  }

  async showCompleted (userId: number): Promise<OrderDetails[]> {
    try {
      const sql =
        'SELECT order_products."id" AS "order_product_id", orders."id" AS order_id, orders.user_id, order_products.product_id, products."name", products.category, products.price, order_products.quantity, orders.status ' +
        'FROM public.orders ' +
        'INNER JOIN public.order_products ON ' +
        'order_products.order_id = orders."id" ' +
        'INNER JOIN public.products ON ' +
        'order_products.product_id = products."id" ' +
        'WHERE orders.user_id=($1) AND orders.status=($2)'
      const conn = await client.connect()

      const result = await conn.query(sql, [userId, 'complete'])

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not find order ${userId}. Error: ${err}`)
    }
  }

  async create (order: Order): Promise<OrderDetails> {
    try {
      let sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING "id"'

      const conn = await client.connect()

      const createdOrderId: number = (await conn.query(sql, [
        order.user_id,
        order.status
      ])).rows[0].id

      sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING "id"'
      const createdOrderProductId: number = (await conn.query(sql, [
        createdOrderId,
        order.product_id,
        order.quantity
      ])).rows[0].id

      sql = 'SELECT order_products."id" AS "order_product_id", orders."id" AS order_id, orders.user_id, order_products.product_id, products."name", products.category, products.price, order_products.quantity, orders.status ' +
        'FROM public.orders ' +
        'INNER JOIN public.order_products ON ' +
        'order_products.order_id = orders."id" ' +
        'INNER JOIN public.products ON ' +
        'order_products.product_id = products."id" ' +
        'WHERE orders.id=($1) AND order_products.id=($2)'
      const createdOrderDetails: OrderDetails = (await conn.query(sql, [
        createdOrderId,
        createdOrderProductId
      ])).rows[0]

      conn.release()

      return createdOrderDetails
    } catch (err) {
      console.log(`creating order error: ${err}`)
      throw new Error(`Could not add new order ${order}. Error: ${err}`)
    }
  }

  async update (order: Order): Promise<Order> {
    try {
      const sql =
        'UPDATE orders SET status=($2) WHERE id=($1) RETURNING *'
      const conn = await client.connect()

      const result = await conn.query(sql, [order.id, order.status])

      const updatedOrder: Order = result.rows[0]

      conn.release()

      updatedOrder.quantity = order.quantity
      updatedOrder.product_id = order.product_id

      return updatedOrder
    } catch (err) {
      console.log(`updating order error: ${err}`)
      throw new Error(
        `Could not update a order ${order.id}. Error: ${err}`
      )
    }
  }

  async delete (id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)'
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const deletedCount = result.rowCount

      conn.release()

      return deletedCount
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`)
    }
  }

  async clear (): Promise<number> {
    try {
      const sql = 'DELETE FROM orders'
      const conn = await client.connect()

      const result = await conn.query(sql)

      const deletedCount = result.rowCount

      conn.release()

      return deletedCount
    } catch (err) {
      throw new Error(`Could not delete orders. Error: ${err}`)
    }
  }
}
