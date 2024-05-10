import { Sequelize, UpdatedAt } from "sequelize-typescript";
import OrderModel from "./order.model";
import OrderClientModel from "./order-client.model";
import OrderProductModel from "./order-product.model";
import OrderRepository from "./order.repository";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

describe("Order repository tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      OrderModel,
      OrderClientModel,
      OrderProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const order = new Order({
      client: new Client({
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
      }),
      products: [
        new Product({
          name: "Product 1",
          description: "This is product 1",
          salesPrice: 100,
        }),
      ],
      status: "pending",
    });

    const orderRepository = new OrderRepository();

    await orderRepository.addOrder(order);

    const model = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [
        { model: OrderClientModel, as: "client" },
        { model: OrderProductModel, as: "products" },
      ],
    });

    expect(model).toBeDefined();
    expect(model.id).toBe(order.id.id);
    expect(model.client).toBeDefined();
    expect(model.client.id).toBe(order.client.id.id);
    expect(model.client.name).toBe(order.client.name);
    expect(model.client.address).toBe(order.client.address);
    expect(model.client.createdAt).toStrictEqual(order.client.createdAt);
    expect(model.client.updatedAt).toStrictEqual(order.client.updatedAt);
    expect(model.products.length).toBe(order.products.length);
    expect(model.products[0].id).toBe(order.products[0].id.id);
    expect(model.products[0].name).toBe(order.products[0].name);
    expect(model.products[0].description).toBe(order.products[0].description);
    expect(model.products[0].salesPrice).toBe(order.products[0].salesPrice);
    expect(model.products[0].createdAt).toStrictEqual(
      order.products[0].createdAt
    );
    expect(model.products[0].updatedAt).toStrictEqual(
      order.products[0].updatedAt
    );
    expect(model.status).toBe(order.status);
    expect(model.createdAt).toStrictEqual(order.createdAt);
    expect(model.updatedAt).toStrictEqual(order.updatedAt);
  });

  it("should find an order", async () => {
    const model = {
      id: "123",
      client: {
        id: "456",
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: "123",
      },
      products: [
        {
          id: "789",
          name: "Product 1",
          description: "This is product 1",
          salesPrice: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          orderId: "123",
        },
      ],
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await OrderModel.create(model, {
      include: [
        { model: OrderClientModel, as: "client" },
        { model: OrderProductModel, as: "products" },
      ],
    });

    const orderRepository = new OrderRepository();

    const order = await orderRepository.findOrder(model.id);

    expect(order).toBeDefined();
    expect(order.id.id).toBe(model.id);
    expect(order.client.id.id).toBe(model.client.id);
    expect(order.client.name).toBe(model.client.name);
    expect(order.client.email).toBe(model.client.email);
    expect(order.client.address).toBe(model.client.address);
    expect(order.client.createdAt).toStrictEqual(model.client.createdAt);
    expect(order.client.updatedAt).toStrictEqual(model.client.updatedAt);
    expect(order.products.length).toBe(model.products.length);
    expect(order.products[0].id.id).toBe(model.products[0].id);
    expect(order.products[0].name).toBe(model.products[0].name);
    expect(order.products[0].description).toBe(model.products[0].description);
    expect(order.products[0].salesPrice).toBe(model.products[0].salesPrice);
    expect(order.products[0].createdAt).toStrictEqual(
      model.products[0].createdAt
    );
    expect(order.products[0].updatedAt).toStrictEqual(
      model.products[0].updatedAt
    );
    expect(order.createdAt).toStrictEqual(model.createdAt);
    expect(order.updatedAt).toStrictEqual(model.updatedAt);
  });
});
