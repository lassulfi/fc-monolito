import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import InvoiceRepository from "./invoice.repository";

describe("Invoice repository tests", () => {
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

  it("should create an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "John Doe",
      document: "123456789",
      address: new Address({
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
      }),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Item 1",
          price: 100,
        }),
      ],
    });

    const repository = new InvoiceRepository();

    await repository.save(invoice);

    const model = await InvoiceModel.findOne({
      where: {
        id: invoice.id.id,
      },
      include: [InvoiceItemsModel],
    });

    expect(model).toBeDefined();
    expect(model.id).toBe(invoice.id.id);
    expect(model.name).toBe(invoice.name);
    expect(model.document).toBe(invoice.document);
    expect(model.street).toBe(invoice.address.street);
    expect(model.number).toBe(invoice.address.number);
    expect(model.complement).toBe(invoice.address.complement);
    expect(model.city).toBe(invoice.address.city);
    expect(model.state).toBe(invoice.address.state);
    expect(model.zipCode).toBe(invoice.address.zipCode);
    expect(model.items.length).toBe(invoice.items.length);
    expect(model.items[0].id).toBe(invoice.items[0].id.id);
    expect(model.items[0].name).toBe(invoice.items[0].name);
    expect(model.items[0].price).toBe(invoice.items[0].price);
    expect(model.items[0].createdAt).toStrictEqual(invoice.items[0].createdAt);
    expect(model.items[0].updatedAt).toStrictEqual(invoice.items[0].updatedAt);
    expect(model.createdAt).toStrictEqual(invoice.createdAt);
    expect(model.updatedAt).toStrictEqual(invoice.updatedAt);
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
      items: [{
        id: "1",
        name: "Item 1",
        price: 100,
        invoiceId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await InvoiceModel.create(model, {
        include: [InvoiceItemsModel]
    });

    const repository = new InvoiceRepository();

    const entity = await repository.find("1");

    expect(entity).toBeDefined();
    expect(entity.id.id).toBe(model.id);
    expect(entity.name).toBe(model.name);
    expect(entity.document).toBe(model.document);
    expect(entity.address.street).toBe(model.street);
    expect(entity.address.number).toBe(model.number);
    expect(entity.address.complement).toBe(model.complement);
    expect(entity.address.city).toBe(model.city);
    expect(entity.address.state).toBe(model.state);
    expect(entity.address.zipCode).toBe(model.zipCode);
    expect(entity.items.length).toBe(model.items.length);
    expect(entity.items[0].id.id).toBe(model.items[0].id);
    expect(entity.items[0].name).toBe(model.items[0].name);
    expect(entity.items[0].price).toBe(model.items[0].price);
    expect(entity.items[0].createdAt).toStrictEqual(model.items[0].createdAt);
    expect(entity.items[0].updatedAt).toStrictEqual(model.items[0].updatedAt);
    expect(entity.createdAt).toStrictEqual(model.createdAt);
    expect(entity.updatedAt).toStrictEqual(model.updatedAt);
  });
});
