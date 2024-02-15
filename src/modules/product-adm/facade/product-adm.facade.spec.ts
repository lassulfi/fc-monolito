import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe("Product Adm Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add a product", async () => {
    const productFacade = ProductAdmFacadeFactory.create()

    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    await productFacade.addProduct(input);

    const product = await ProductModel.findOne({ where: { id: input.id } });

    expect(product).toBeDefined();
    expect(product.id).toBe(input.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
    expect(product.purchasePrice).toBe(input.purchasePrice);
    expect(product.stock).toBe(input.stock);
  });

  it("should check stock of a product", async () => {
    await ProductModel.create({
        id: 1,
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    })

    const productFacade = ProductAdmFacadeFactory.create()

    const input = {
        productId: "1"
    }

    const stock = await productFacade.checkStock(input)

    expect(stock).toBeDefined()
    expect(stock.productId).toEqual(input.productId)
    expect(stock.stock).toEqual(10)
  })
});
