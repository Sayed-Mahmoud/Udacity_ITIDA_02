import app from '../../server'
import chai from 'chai'
import chaiHttp = require('chai-http')
import 'mocha'
import { User, ApplicationUsers } from '../../models/user'
import { Product, StockProducts } from '../../models/product'
import { Order, OrderDetails, UserOrders } from '../../models/order'
// const expect = chai.expect;
const appUser = new ApplicationUsers()
const stockProducts = new StockProducts()
const userOrders = new UserOrders()
chai.use(chaiHttp)

let createdUser: User
let createdProduct: Product
let createdOrder: Order
let createdOrderDetail: OrderDetails
const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiJDJiJDEwJFlycVZySTUxY1p4bWs4OHlzSWZuUXV2UGk1Rjg1eXM1U3lTcFhieWFyQU1Ub2hjbm50U21LIn0sImlhdCI6MTY1NTcyNjk1NH0.deMwtxZMr_m-vhncz0WUOVcHfq4-Nm1bs9e18jsuPVs'

describe('User Orders Handler', async () => {
    it('create should be response with created order on call', async () => {
        await userOrders.clear()
        await stockProducts.clear()
        await appUser.clear()

        createdUser = await appUser.create({
            firstname: 'Sayed',
            lastname: 'Gomaa',
            password: '123456',
        })
        createdProduct = await stockProducts.create({
            name: 'Micro-SD-Card',
            price: 12345,
            category: 'Mobile-Parts',
        })

        return chai
            .request(app)
            .post(
                `/orders?userid=${createdUser.id}&productid=${createdProduct.id}&quantity=100&status=complete`
            )
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .then(async (res) => {
                chai.expect(res.status).to.equals(200)

                createdOrder = JSON.parse(res.text) as Order
                chai.expect(createdOrder.id).to.equals(createdOrder.id)
                chai.expect(createdOrder.product_id).to.equals(
                    createdProduct.id
                )
                chai.expect(createdOrder.user_id).to.equals(createdUser.id)
                chai.expect(createdOrder.quantity).to.equals(100)
                chai.expect(createdOrder.status).to.equals('complete')
            })
    })

    it('completed should be response with completed orders or empty on call', () => {
        createdOrderDetail = {
            id: createdOrder.id as number,
            user_id: createdUser.id as number,
            product_id: createdProduct.id as number,
            name: createdProduct.name,
            category: createdProduct.category,
            price: createdProduct.price.toString(),
            quantity: createdOrder.quantity,
            status: createdOrder.status,
        }
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
        return chai
            .request(app)
            .delete('/orders')
            .send(`id=${createdOrder.id}`)
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .then(async (res) => {
                chai.expect(res.status).to.equals(200)

                const value = JSON.parse(res.text) as number
                chai.expect(value).to.equals(1)
            })
    })
})
