import { Sequelize } from "sequelize-typescript"
import { Umzug } from "umzug"
import { migrator } from "../../../../config/migrator/migrator"
import ClientModel from "../../../client-adm/repository/client.model"
import ProductModel from "../../../product-adm/repository/product.model"
import OrderModel from "../../repository/order.model"
import OrderClientModel from "../../repository/order-client.model"
import OrderProductModel from "../../repository/order-product.model"
import InvoiceModel from "../../../invoice/repository/invoice.model"
import InvoiceItemsModel from "../../../invoice/repository/invoice-items.model"
import TransactionModel from "../../../payment/repository/transaction.model"
import request from "supertest"
import { app } from "../../../infrastructure/api/express"
import ProductStorageModel from "../../../store-catalog/repository/product-storage.model"

const clientInput = {
    id: "1",
    name: "Client 1",
    email: "client1@example.com",
    document: "123456789",
    street: "Street 1",
    number: "123",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "12345-678",
    createdAt: new Date(),
    updatedAt: new Date(),
}

const productInput = {
    id: "1",
    name: "Product 1",
    description: "Product 1 description",
    purchasePrice: 200,
    salesPrice: 220,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
}

describe("E2E checkout route tests", () => {
    let sequelize: Sequelize

    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        })

        sequelize.addModels([
            ClientModel, 
            ProductModel,
            ProductStorageModel,
            OrderModel, 
            OrderClientModel, 
            OrderProductModel,
            InvoiceModel,
            InvoiceItemsModel,
            TransactionModel,
        ])

        migration = migrator(sequelize)

        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) return
    
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    }) 

    it("should place an order", async () => {
        const clientResponse = await request(app).post("/clients").send({
            name: clientInput.name,
            email: clientInput.email,
            document: clientInput.document,
            street: clientInput.street,
            number: clientInput.number,
            complement: clientInput.complement,
            city: clientInput.city,
            state: clientInput.state,
            zipCode: clientInput.zipCode,
        })

        expect(clientResponse.status).toBe(201)
        expect(clientResponse.body).toMatchObject({
            id: expect.any(String),
            name: clientInput.name,
            email: clientInput.email,
            document: clientInput.document,
            street: clientInput.street,
            number: clientInput.number,
            complement: clientInput.complement,
            city: clientInput.city,
            state: clientInput.state,
            zipCode: clientInput.zipCode,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })

        const productResponse = await request(app).post("/products").send({
            name: productInput.name,
            description: productInput.description,
            purchasePrice: productInput.purchasePrice,
            stock: productInput.stock,
        })

        expect(productResponse.status).toBe(201)
        expect(productResponse.body).toMatchObject({
            id: expect.any(String),
            name: productInput.name,
            description: productInput.description,
            purchasePrice: productInput.purchasePrice,
            stock: productInput.stock,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })

        const productId = productResponse.body.id

        await ProductStorageModel.update({
            salesPrice: productInput.salesPrice,
        }, {
            where: {
                id: productId
            }
        })

        const productStorage = await ProductStorageModel.findOne({
            where: {
                id: productResponse.body.id
            }
        })
        expect(productStorage).toBeDefined()
        expect(productStorage).toMatchObject({
            id: productId,
            name: productInput.name,
            description: productInput.description,
            salesPrice: productInput.salesPrice,
        })

        const clientId = clientResponse.body.id

        const checkoutResponse = await request(app)
            .post("/checkout")
            .send({
                clientId: clientId,
                products: [
                    {
                        productId: productId,
                        quantity: 1
                    }
                ]
            })

        expect(checkoutResponse.status).toBe(201)
        expect(checkoutResponse.body).toMatchObject({
            id: expect.any(String),
            invoiceId: expect.any(String),
            status: 'approved',
            total: 120,
            products: [
                {
                    productId: productId,
                }
            ],
        })
    })
})

