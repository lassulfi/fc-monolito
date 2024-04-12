import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Client repository test", () => {
    let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a client", async () => {
    const client = await ClientModel.create({
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
    })

    const repository = new ClientRepository();

    const result = await repository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toEqual(client.document);
    expect(result.street).toEqual(client.street);
    expect(result.number).toEqual(client.number);
    expect(result.complement).toEqual(client.complement);
    expect(result.city).toEqual(client.city);
    expect(result.state).toEqual(client.state);
    expect(result.zipCode).toEqual(client.zipCode);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  })

  it("should add a client", async () => {
    const client = new Client({
        id: new Id("1"),
        name: "Client 1",
        email: "client1@example.com",
        document: "123456789",
        street: "Street 1",
        number: "123",
        complement: "Apartment 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
    })

    const repository = new ClientRepository();

    await repository.add(client);

    const model = await ClientModel.findOne({
        where: { id: client.id.id }
    })

    expect(model).toBeDefined();
    expect(model.id).toEqual(client.id.id);
    expect(model.name).toEqual(client.name);
    expect(model.email).toEqual(client.email);
    expect(model.document).toEqual(client.document);
    expect(model.street).toEqual(client.street);
    expect(model.number).toEqual(client.number);
    expect(model.complement).toEqual(client.complement);
    expect(model.city).toEqual(client.city);
    expect(model.state).toEqual(client.state);
    expect(model.zipCode).toEqual(client.zipCode);
    expect(model.createdAt).toEqual(client.createdAt);
    expect(model.updatedAt).toEqual(client.updatedAt);
  })
})