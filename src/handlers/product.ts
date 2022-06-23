import express, { Request, Response } from 'express'
import { Product, StockProducts } from '../models/product'
import jwt from 'jsonwebtoken'

const stockProduct = new StockProducts()
const productRoutes = express.Router()

const index = async (_req: Request, res: Response) => {
    const products = await stockProduct.index()
    res.json(products)
}

const top5 = async (req: Request, res: Response) => {
    const products = await stockProduct.top5()
    res.json(products)
}

const show = async (req: Request, res: Response) => {
    const productId: number = parseInt(req.params.id)
    if (isNaN(productId)) {
        res.send('Please provide a valid Product id!')
        return
    }

    const product = await stockProduct.show(productId)
    res.json(product)
}

const prodByCats = async (req: Request, res: Response) => {
    const cat = req.params.cat as string
    if (cat === undefined || cat.length === 0) {
        res.send('Please provide a valid product category!')
        return
    }

    const products = await stockProduct.productsByCat(cat)
    res.json(products)
}

const create = async (req: Request, res: Response) => {
    const prodName = req.query.name as string
    const price = parseFloat(req.query.price as string)
    const cat = req.query.category as string
    if (
        prodName === undefined ||
        prodName.length === 0 ||
        price === undefined ||
        isNaN(price) ||
        price <= 0
    ) {
        res.send('Please provide a valid Product details!')
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

    const product: Product = {
        name: prodName,
        price,
        category: cat,
    }
    try {
        const newProduct = await stockProduct.create(product)
        res.json(newProduct)
    } catch (err) {
        res.status(400)
        res.json(`Error product create: ${err}`)
    }
}

const update = async (req: Request, res: Response) => {
    const id = parseInt(req.query.id as string)
    const prodName = req.query.name as string
    const price = parseFloat(req.query.price as string)
    const cat = req.query.category as string
    if (
        id === undefined ||
        isNaN(id) ||
        prodName === undefined ||
        prodName.length === 0 ||
        price === undefined ||
        isNaN(price) ||
        price <= 0
    ) {
        res.send('Please provide a valid Product details!')
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

    const product: Product = {
        id,
        name: prodName,
        price,
        category: cat,
    }
    try {
        const updated = await stockProduct.update(product)
        res.json(updated)
    } catch (err) {
        res.status(400)
        res.json((err as string) + product)
    }
}

const destroy = async (req: Request, res: Response) => {
    const productId: number = parseInt(req.body.id)
    if (isNaN(productId)) {
        res.send('Please provide a valid Product id!')
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

    const deleted = await stockProduct.delete(productId)
    res.json(deleted)
}

productRoutes.get('/products', index)
productRoutes.get('/products/top5', top5)
productRoutes.get('/products/cats/:cat', prodByCats)
productRoutes.get('/products/:id', show)
productRoutes.post('/products', create)
productRoutes.put('/products', update)
productRoutes.delete('/products', destroy)

export default productRoutes
