import { /* Product, */ StockProducts } from '../product'

const stockProducts = new StockProducts()

describe('Stock Products Model', () => {
    it('should have an index method', () => {
        expect(stockProducts.index).toBeDefined()
    })

    it('should have a show method', () => {
        expect(stockProducts.show).toBeDefined()
    })

    it('should have a create method', () => {
        expect(stockProducts.create).toBeDefined()
    })

    it('should have a update method', () => {
        expect(stockProducts.update).toBeDefined()
    })

    it('should have a top 5 method', () => {
        expect(stockProducts.top5).toBeDefined()
    })

    it('should have a products by category method', () => {
        expect(stockProducts.productsByCat).toBeDefined()
    })

    it('should have a delete method', () => {
        expect(stockProducts.delete).toBeDefined()
    })

    it('should have a clear method to delete all products', () => {
        expect(stockProducts.clear).toBeDefined()
    })
})

describe('Stock Products database interaction', () => {
    it('clear method should delete all exists products', async () => {
        const result = await stockProducts.clear()
        expect(result).toBeGreaterThanOrEqual(0)
    })

    let createdId: number

    it('create method should add a product', async () => {
        const result = await stockProducts.create({
            name: 'Kingston NVM A2000 1TB',
            price: 1999.99,
            category: 'SSD',
        })
        createdId = result.id as number
        result.price = parseFloat(result.price.toString())
        expect(result).toEqual({
            id: createdId,
            name: 'Kingston NVM A2000 1TB',
            price: 1999.99,
            category: 'SSD',
        })
    })

    it('index method should return a list of products', async () => {
        const result = await stockProducts.index()
        result[0].price = parseFloat(result[0].price.toString())
        expect(result).toEqual([
            {
                id: createdId,
                name: 'Kingston NVM A2000 1TB',
                price: 1999.99,
                category: 'SSD',
            },
        ])
    })

    it('show method should return the correct product', async () => {
        const result = await stockProducts.show(createdId)
        result.price = parseFloat(result.price.toString())
        expect(result).toEqual({
            id: createdId,
            name: 'Kingston NVM A2000 1TB',
            price: 1999.99,
            category: 'SSD',
        })
    })

    it('top 5 method should return the correct category', async () => {
        const result = await stockProducts.top5()
        expect(result).toEqual([Object({ category: 'SSD' })])
    })

    it('products by category method should return the correct product', async () => {
        const result = await stockProducts.productsByCat('SSD')
        result[0].price = parseFloat(result[0].price.toString())
        expect(result).toEqual([
            {
                id: createdId,
                name: 'Kingston NVM A2000 1TB',
                price: 1999.99,
                category: 'SSD',
            },
        ])
    })

    it('update method should return the updated product', async () => {
        const result = await stockProducts.update({
            id: createdId,
            name: 'sandisk NVM Extreme PRO 1TB',
            price: 2400.0,
            category: 'SSD',
        })
        result.price = parseFloat(result.price.toString())
        expect(result).toEqual({
            id: createdId,
            name: 'sandisk NVM Extreme PRO 1TB',
            price: 2400.0,
            category: 'SSD',
        })
    })

    it('delete method should remove the product', async () => {
        await stockProducts.delete(createdId)

        const result = await stockProducts.index()

        expect(result).toEqual([])
    })
})
