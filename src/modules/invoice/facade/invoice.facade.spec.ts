import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import e from "express";

describe("Invoice facade tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate invoice", async () => {
    const input = {
      id: "1",
      name: "John Doe",
      document: "123456789",
      street: "Street 1",
      number: "123",
      complement: "Apartment 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345-678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 100,
        },
      ],
    };

    const facade = InvoiceFacadeFactory.create();

    const output = await facade.generate(input);

    expect(output).toBeDefined();
    expect(output.id).toBe(input.id);
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items.length).toBe(input.items.length);
    expect(output.items[0].id).toBe(input.items[0].id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBe(input.items[1].id);
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
    expect(output.total).toBe(200);

    const model = await InvoiceModel.findOne({
      where: { id: input.id },
      include: [InvoiceItemsModel],
    });

    expect(model).toBeDefined();
    expect(model.id).toBe(output.id);
    expect(model.name).toBe(output.name);
    expect(model.document).toBe(output.document);
    expect(model.street).toBe(output.street);
    expect(model.number).toBe(output.number);
    expect(model.complement).toBe(output.complement);
    expect(model.city).toBe(output.city);
    expect(model.state).toBe(output.state);
    expect(model.zipCode).toBe(output.zipCode);
    expect(model.items.length).toBe(output.items.length);
    expect(model.items[0].id).toBe(output.items[0].id);
    expect(model.items[0].name).toBe(output.items[0].name);
    expect(model.items[0].price).toBe(output.items[0].price);
    expect(model.items[1].id).toBe(output.items[1].id);
    expect(model.items[1].name).toBe(output.items[1].name);
    expect(model.items[1].price).toBe(output.items[1].price);
  });

  it("should find an invoice", async () => {
    const model = {
        id: "1",
        name: "John Doe",
        document: "123456789",
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
        items: [
          {
            id: "1",
            name: "Item 1",
            price: 100,
            invoiceId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "Item 2",
            price: 100,
            invoiceId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

    await InvoiceModel.create(
      model,
      {
        include: [InvoiceItemsModel],
      }
    );

    const input = { id: "1" }

    const facade = InvoiceFacadeFactory.create();

    const output = await facade.find(input);

    expect(output).toBeDefined();
    expect(output.id).toBe(model.id);
    expect(output.name).toBe(model.name);
    expect(output.document).toBe(model.document);
    expect(output.address.street).toBe(model.street);
    expect(output.address.number).toBe(model.number);
    expect(output.address.complement).toBe(model.complement);
    expect(output.address.city).toBe(model.city);
    expect(output.address.state).toBe(model.state);
    expect(output.address.zipCode).toBe(model.zipCode);
    expect(output.items.length).toBe(model.items.length);
    expect(output.items[0].id).toBe(model.items[0].id);
    expect(output.items[0].name).toBe(model.items[0].name);
    expect(output.items[0].price).toBe(model.items[0].price);
    expect(output.items[1].id).toBe(model.items[1].id);
    expect(output.items[1].name).toBe(model.items[1].name);
    expect(output.items[1].price).toBe(model.items[1].price);
    expect(output.total).toBe(200);
    expect(output.createdAt).toBeDefined()
  });
});
