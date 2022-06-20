import { /* Order, */ UserOrders } from '../order'
import { ApplicationUsers } from '../user'
import { StockProducts } from '../product'

const userOrders = new UserOrders()

describe('User Orders Model', () => {
  it('should have a show method', () => {
    expect(userOrders.show).toBeDefined()
  })

  it('should have a show completed orders method', () => {
    expect(userOrders.showCompleted).toBeDefined()
  })

  it('should have a show method', () => {
    expect(userOrders.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(userOrders.create).toBeDefined()
  })

  it('should have a update method', () => {
    expect(userOrders.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(userOrders.delete).toBeDefined()
  })

  it('should have a clear method to delete all Orders', () => {
    expect(userOrders.clear).toBeDefined()
  })
})

describe('User Orders Handler', () => {
  it('clear method should delete all exists orders', async () => {
    const result = await userOrders.clear()
    expect(result).toBeGreaterThanOrEqual(0)
  })

  let createdUserId: number
  let createdProductId: number
  let createdId: number

  it('create method should add an order', async () => {
    const appUsers = new ApplicationUsers()
    const userResult = await appUsers.create({
      firstname: 'sayed',
      lastname: 'gomaa',
      password: 'test'
    })
    createdUserId = userResult.id as number

    const stockProducts = new StockProducts()
    const prodResult = await stockProducts.create({
      name: 'Kingston NVM A2000 1TB',
      price: 1999.99,
      category: 'SSD'
    })
    createdProductId = prodResult.id as number

    const result = await userOrders.create({
      user_id: createdUserId,
      product_id: createdProductId,
      quantity: 2,
      status: 'complete'
    })
    createdId = result.id as number

    expect(result).toEqual({
      id: createdId,
      user_id: createdUserId,
      product_id: createdProductId,
      quantity: 2,
      status: 'complete'
    })
  })

  it('show method should return the correct user order details', async () => {
    const result = await userOrders.show(createdUserId)
    expect(result).toEqual([
      {
        id: createdId,
        user_id: createdUserId,
        product_id: createdProductId,
        name: 'Kingston NVM A2000 1TB',
        price: '1999.99',
        category: 'SSD',
        quantity: 2,
        status: 'complete'
      }
    ])
  })

  it('showCompleted method should return the correct user order details', async () => {
    const result = await userOrders.showCompleted(createdUserId)
    expect(result).toEqual([
      {
        id: createdId,
        user_id: createdUserId,
        product_id: createdProductId,
        name: 'Kingston NVM A2000 1TB',
        price: '1999.99',
        category: 'SSD',
        quantity: 2,
        status: 'complete'
      }
    ])
  })

  it('update method should return the updated order', async () => {
    const result = await userOrders.update({
      id: createdId,
      user_id: createdUserId,
      product_id: createdProductId,
      quantity: 2,
      status: 'active'
    })
    expect(result).toEqual({
      id: createdId,
      user_id: createdUserId,
      product_id: createdProductId,
      quantity: 2,
      status: 'active'
    })
  })

  it('delete method should remove the order', async () => {
    await userOrders.delete(createdId)

    const result = await userOrders.show(createdUserId)

    expect(result).toEqual([])
  })
})
