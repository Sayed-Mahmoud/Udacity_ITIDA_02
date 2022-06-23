import client from '../database'

export type Order = {
    id?: number
    user_id: number
    product_id: number
    quantity: number
    status: string
}

export type OrderDetails = {
    id: number
    user_id: number
    product_id: number
    name: string
    category: string
    price: string
    quantity: number
    status: string
}

export class UserOrders {
    async show(userId: number): Promise<OrderDetails[]> {
        try {
            const sql =
                'SELECT orders."id", orders.product_id, orders.user_id, products."name", products.category, products.price, orders.quantity, orders.status ' +
                'FROM public.orders ' +
                'INNER JOIN public.products ON ' +
                'orders.product_id = products."id" ' +
                'WHERE orders.user_id=($1)'
            const conn = await client.connect()

            const result = await conn.query(sql, [userId])

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Could not find order ${userId}. Error: ${err}`)
        }
    }

    async showCompleted(userId: number): Promise<OrderDetails[]> {
        try {
            const sql =
                'SELECT orders."id", orders.product_id, orders.user_id, products."name", products.category, products.price, orders.quantity, orders.status ' +
                'FROM public.orders ' +
                'INNER JOIN public.products ON ' +
                'orders.product_id = products."id" ' +
                'WHERE orders.user_id=($1) AND orders.status=($2)'
            const conn = await client.connect()

            const result = await conn.query(sql, [userId, 'complete'])

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Could not find order ${userId}. Error: ${err}`)
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const sql =
                'INSERT INTO orders (product_id, user_id, quantity, status) VALUES($1, $2, $3, $4) RETURNING *'
            const conn = await client.connect()

            const result = await conn.query(sql, [
                order.product_id,
                order.user_id,
                order.quantity,
                order.status,
            ])

            const CreatedOrder: Order = result.rows[0]

            conn.release()

            return CreatedOrder
        } catch (err) {
            console.log(`creating order error: ${err}`)
            throw new Error(`Could not add new order ${order}. Error: ${err}`)
        }
    }

    async update(order: Order): Promise<Order> {
        try {
            const sql =
                'UPDATE orders SET status=($2) WHERE id=($1) RETURNING *'
            const conn = await client.connect()

            const result = await conn.query(sql, [order.id, order.status])

            const updatedOrder: Order = result.rows[0]

            conn.release()

            return updatedOrder
        } catch (err) {
            console.log(`updating order error: ${err}`)
            throw new Error(
                `Could not update a order ${order.id}. Error: ${err}`
            )
        }
    }

    async delete(id: number): Promise<number> {
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

    async clear(): Promise<number> {
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
