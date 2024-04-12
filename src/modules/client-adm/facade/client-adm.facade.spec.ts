import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("Client ADM facade tests", () => {
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

  it("should create a client", async () => {
    const clientRepository = new ClientRepository();
    const addClientUseCase = new AddClientUseCase({ clientRepository });

    const facade = new ClientAdmFacade({
      addClientUseCase,
      findClientUseCase: undefined,
    });

    const input = {
      id: "1",
      name: "Client 1",
      email: "c@c.com",
      document: "123456789",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "ZipCode 1",
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: input.id } });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.street).toBe(input.street);
    expect(client.number).toBe(input.number);
    expect(client.complement).toBe(input.complement);
    expect(client.city).toBe(input.city);
    expect(client.state).toBe(input.state);
    expect(client.zipCode).toBe(input.zipCode);
  });

  it("should find a client", async () => {
    await ClientModel.create({
        id: "1",
        name: "Client 1",
        email: "c@c.com",
        document: "123456789",
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "ZipCode 1",
        createdAt: new Date(),
        updatedAt: new Date(),
    })
;
    const facade = ClientAdmFacadeFactory.create();

    const result = await facade.find({ id: "1" })

    expect(result).toBeDefined()
    expect(result.id).toBe("1")
    expect(result.name).toBe("Client 1")
    expect(result.email).toBe("c@c.com")
    expect(result.document).toBe("123456789")
    expect(result.street).toBe("Street 1")
    expect(result.number).toBe("1")
    expect(result.complement).toBe("Complement 1")
    expect(result.city).toBe("City 1")
    expect(result.state).toBe("State 1")
    expect(result.zipCode).toBe("ZipCode 1")
  });
});
