import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("Store Catalog facade test", () => {
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

  it("should find a product", async () => {
    await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
    })

    const facade = StoreCatalogFacadeFactory.create();

    const result = await facade.find({ id: "1" });

    expect(result).toBeDefined();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Product 1 description");
    expect(result.salesPrice).toBe(100);
  })

  it("should find all products", async () => {
    await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
    })

    await ProductModel.create({
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 200,
    })

    const facade = StoreCatalogFacadeFactory.create();

    const result = await facade.findAll();

    const {products} = result;

    expect(result).toBeDefined();
    expect(products).toBeDefined();
    expect(products.length).toBe(2);
    expect(products[0].id).toBe("1");
    expect(products[0].name).toBe("Product 1");
    expect(products[0].description).toBe("Product 1 description");
    expect(products[0].salesPrice).toBe(100);
    expect(products[1].id).toBe("2");
    expect(products[1].name).toBe("Product 2");
    expect(products[1].description).toBe("Product 2 description");
    expect(products[1].salesPrice).toBe(200);
  })
});
