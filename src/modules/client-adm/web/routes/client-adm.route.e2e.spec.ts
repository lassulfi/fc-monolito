import { Sequelize } from "sequelize-typescript"
import { app } from "../../../infrastructure/api/express"
import request from "supertest"
import { Umzug } from "umzug"
import ClientModel from "../../repository/client.model"
import { migrator } from "../../../../config/migrator/migrator"


describe('E2E test for client routes', () => {

    let sequelize: Sequelize

    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        })

        sequelize.addModels([ClientModel])

        migration = migrator(sequelize)

        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) return
    
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    it("should create a client", async () => {
        const response = await request(app)
            .post('/clients')
            .send({
                name: "John Doe",
                email: "jd@email.com",
                document: "123456789",
                street: "Street",
                number: "123",
                complement: "Complement",
                city: "City",
                state: "State",
                zipCode: "12345-678"
        })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            id: expect.any(String),
            name: "John Doe",
            email: "jd@email.com",
            document: "123456789",
            street: "Street",
            number: "123",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "12345-678",
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    })
})