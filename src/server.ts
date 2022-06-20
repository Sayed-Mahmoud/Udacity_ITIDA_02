import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRoutes from './handlers/users'
import productRoutes from './handlers/product'
import orderRoutes from './handlers/order'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', [userRoutes, productRoutes, orderRoutes])

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!')
})

app.listen(port, function () {
  console.log(`starting app on: ${port}`)
})
