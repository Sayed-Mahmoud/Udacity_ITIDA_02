import app from '../../server'
import chai from 'chai'
import chaiHttp = require('chai-http')
import 'mocha'
import { User, ApplicationUsers } from '../../models/user'
import { Product, StockProducts } from '../../models/product'
import { OrderDetails, UserOrders } from '../../models/order'
import jwt from 'jsonwebtoken'
// const expect = chai.expect;
const appUser = new ApplicationUsers()
const stockProducts = new StockProducts()
const userOrders = new UserOrders()
chai.use(chaiHttp)

let createdUser: User
let hashedPass: { password: string }
let createdProduct: Product
let createdOrderDetail: OrderDetails
let token: string //= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiJDJiJDEwJFlycVZySTUxY1p4bWs4OHlzSWZuUXV2UGk1Rjg1eXM1U3lTcFhieWFyQU1Ub2hjbm50U21LIn0sImlhdCI6MTY1NTcyNjk1NH0.deMwtxZMr_m-vhncz0WUOVcHfq4-Nm1bs9e18jsuPVs'

describe('User Orders Handler', async () => {
  it('create should be response with created order on call', async () => {
    await userOrders.clear()
    await stockProducts.clear()
    await appUser.clear()

    createdUser = await appUser.create({
      firstname: 'Sayed',
      lastname: 'Gomaa',
      password: '123456'
    })
    createdProduct = await stockProducts.create({
      name: 'Micro-SD-Card',
      price: 12345.99,
      category: 'Mobile-Parts'
    })

    hashedPass = { password: createdUser.password }
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)

    return chai
      .request(app)
      .post(
        `/orders?userid=${createdUser.id}&productid=${createdProduct.id}&quantity=100&status=complete`
      )
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        createdOrderDetail = JSON.parse(res.text) as OrderDetails
        chai.expect(createdOrderDetail.user_id).to.equals(createdUser.id)
        chai.expect(createdOrderDetail.product_id).to.equals(createdProduct.id)
        chai.expect(createdOrderDetail.name).to.equals('Micro-SD-Card')
        chai.expect(createdOrderDetail.category).to.equals('Mobile-Parts')
        chai.expect(createdOrderDetail.price).to.equals('12345.99')
        chai.expect(createdOrderDetail.quantity).to.equals(100)
        chai.expect(createdOrderDetail.status).to.equals('complete')
      })
  })

  it('completed should be response with completed orders or empty on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .get(`/orders/completed/${createdUser.id}`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as OrderDetails[]
        chai.expect(value).to.eqls([createdOrderDetail])
      })
  })

  it('show should be response with all user orders or empty on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .get(`/orders/${createdUser.id}`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as OrderDetails[]
        chai.expect(value.length).to.equals(1)
        chai.expect(value).to.eqls([createdOrderDetail])
      })
  })

  it('delete should be response with the order that was deleted on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .delete('/orders')
      .send(`id=${createdOrderDetail.order_id}`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as number
        chai.expect(value).to.equals(1)
      })
  })
})
