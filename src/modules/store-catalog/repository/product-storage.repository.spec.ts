import { Sequelize } from "sequelize-typescript";
import ProductStorageModel from "./product-storage.model";
import ProductRepository from "./product-storage.repository";

describe("Product Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductStorageModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find all products", async () => {
    const product1 = await ProductStorageModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
    })

    const product2 = await ProductStorageModel.create({
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 200,
    })

    const productRepository = new ProductRepository()

    const products = await productRepository.findAll();

    expect(products.length).toBe(2)
    expect(products[0].id.id).toEqual(product1.id)
    expect(products[0].name).toEqual(product1.name)
    expect(products[0].description).toEqual(product1.description)
    expect(products[0].salesPrice).toEqual(product1.salesPrice)
    expect(products[1].id.id).toEqual(product2.id)
    expect(products[1].name).toEqual(product2.name)
    expect(products[1].description).toEqual(product2.description)
    expect(products[1].salesPrice).toEqual(product2.salesPrice)
  })

  it("should find a product", async () => {

    await ProductStorageModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
    })

    const productRepository = new ProductRepository()
    const product = await productRepository.find("1")

    expect(product.id.id).toEqual("1")
    expect(product.name).toEqual("Product 1")
    expect(product.description).toEqual("Product 1 description")
    expect(product.salesPrice).toEqual(100)

  })
});
