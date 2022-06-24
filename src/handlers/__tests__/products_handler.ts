import app from '../../server'
import chai from 'chai'
import chaiHttp = require('chai-http')
import 'mocha'
import { User, ApplicationUsers } from '../../models/user'
import { Product, StockProducts } from '../../models/product'
import jwt from 'jsonwebtoken'
// const expect = chai.expect;
const stockProducts = new StockProducts()
const appUser = new ApplicationUsers()
chai.use(chaiHttp)

const ToCreateUser: User = { firstname: 'Test', lastname: 'Test2', password: 'test1234' }
let hashedPass: { password: string }
let createdProduct: Product
let token: string // = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiJDJiJDEwJFlycVZySTUxY1p4bWs4OHlzSWZuUXV2UGk1Rjg1eXM1U3lTcFhieWFyQU1Ub2hjbm50U21LIn0sImlhdCI6MTY1NTcyNjk1NH0.deMwtxZMr_m-vhncz0WUOVcHfq4-Nm1bs9e18jsuPVs'

describe('Stock Products Handler', async () => {
  it('create should be response with created product on call', async () => {
    await stockProducts.clear()
    await appUser.clear()
    hashedPass = { password: (await appUser.create(ToCreateUser)).password }

    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)

    return chai
      .request(app)
      .post('/products?name=mobile&price=123.4&category=phone')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        createdProduct = JSON.parse(res.text) as Product
        chai.expect(createdProduct.name).to.equals('mobile')
        chai.expect(createdProduct.category).to.equals('phone')
        chai.expect(createdProduct.price).to.equals('123.40')
      })
  })

  it('index should be response with all products on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .get('/products')
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as Product[]
        chai.expect(value).to.eqls([createdProduct])
      })
  })

  it('top5 should be response with a top 5 products', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)

    return chai
      .request(app)
      .get('/products/top5')
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text)
        chai.expect(value).to.eqls([
          { category: `${createdProduct.category}` }
        ])
      })
  })

  it('cats:Categories should be response with the created products that contains same category on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .get(`/products/cats/${createdProduct.category}`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as Product[]
        chai.expect(value).to.eqls([createdProduct])
      })
  })

  it('update should be response with a single updated product on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .put(
        `/products?id=${createdProduct.id}&name=Keyboard&price=4567.89&category=ComputerParts`
      )
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as Product
        chai.expect(value.id).to.equals(createdProduct.id)
        chai.expect(value.name).to.equals('Keyboard')
        chai.expect(value.category).to.equals('ComputerParts')
        chai.expect(value.price).to.equals('4567.89')
        createdProduct = value
      })
  })

  it('show should be response with a single product or empty on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .get(`/products/${createdProduct.id}`)
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as Product
        chai.expect(value).to.eqls(createdProduct)
      })
  })

  it('delete should be response with the product that was deleted on call', () => {
    token = jwt.sign({ user: hashedPass }, process.env.TOKEN_SECRET as string)
    return chai
      .request(app)
      .delete('/products')
      .send(`id=${createdProduct.id}`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .then(async (res) => {
        chai.expect(res.status).to.equals(200)

        const value = JSON.parse(res.text) as number
        chai.expect(value).to.equals(1)
      })
  })
})
