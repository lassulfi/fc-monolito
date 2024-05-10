import { Sequelize } from "sequelize-typescript"
import { Umzug } from "umzug"
import ProductModel from "../../repository/product.model"
import { migrator } from "../../../../config/migrator/migrator"
import { app } from "../../../infrastructure/api/express"
import request from "supertest"

describe("E2E tests for products routes", () => {
    let sequelize: Sequelize

    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        })

        sequelize.addModels([ProductModel])

        migration = migrator(sequelize)

        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) return
    
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })  

    it("should create a product", async () => {
        const product = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
        }

        const response = await request(app)
            .post("/products")
            .send(product)
            .expect(201)

        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: product.name,
                description: product.description,
                purchasePrice: product.purchasePrice,
                stock: product.stock,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        )
    })
})