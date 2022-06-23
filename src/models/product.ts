import client from '../database'

export type Product = {
    id?: number
    name: string
    price: number
    category: string
}

export class StockProducts {
  async index (): Promise<Product[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM products'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`cannot get products ${err}`)
    }
  }

  async show (id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  async top5 (): Promise<string[]> {
    try {
      const conn = await client.connect()
      const sql =
                'SELECT category FROM public.products GROUP BY category ORDER BY COUNT(category) DESC LIMIT 5'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`cannot get products ${err}`)
    }
  }

  async productsByCat (cat: string | undefined): Promise<Product[]> {
    try {
      const sql =
                "SELECT * FROM products WHERE category LIKE '%' || ($1) || '%'"
      const conn = await client.connect()

      const result = await conn.query(sql, [cat])

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`cannot get products cat ${cat}, ${err}`)
    }
  }

  async create (product: Product): Promise<Product> {
    try {
      const sql =
                'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *'
      const conn = await client.connect()

      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category
      ])

      const CreatedProduct: Product = result.rows[0]

      conn.release()

      return CreatedProduct
    } catch (err) {
      console.log(`creating product error: ${err}`)
      throw new Error(
                `Could not add new product ${product}. Error: ${err}`
      )
    }
  }

  async update (product: Product): Promise<Product> {
    try {
      const sql =
                'UPDATE products SET name=($2), price=($3), category=($4) WHERE id=($1) RETURNING *'
      const conn = await client.connect()

      const result = await conn.query(sql, [
        product.id,
        product.name,
        product.price,
        product.category
      ])

      const updatedProduct: Product = result.rows[0]

      conn.release()

      return updatedProduct
    } catch (err) {
      console.log(`updating product error: ${err}`)
      throw new Error(
                `Could not update a product ${product.id}. Error: ${err}`
      )
    }
  }

  async delete (id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)'
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const deletedCount = result.rowCount

      conn.release()

      return deletedCount
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`)
    }
  }

  async clear (): Promise<number> {
    try {
      const sql = 'DELETE FROM products'
      const conn = await client.connect()

      const result = await conn.query(sql)

      const deletedCount = result.rowCount

      conn.release()

      return deletedCount
    } catch (err) {
      throw new Error(`Could not delete products. Error: ${err}`)
    }
  }
}
