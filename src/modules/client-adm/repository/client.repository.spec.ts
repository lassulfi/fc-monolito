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
        address: "Address 1",
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    const repository = new ClientRepository();

    const result = await repository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  })

  it("should add a client", async () => {
    const client = new Client({
        id: new Id("1"),
        name: "Client 1",
        email: "client1@example.com",
        address: "Address 1",
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
    expect(model.address).toEqual(client.address);
    expect(model.createdAt).toEqual(client.createdAt);
    expect(model.updatedAt).toEqual(client.updatedAt);
  })
})