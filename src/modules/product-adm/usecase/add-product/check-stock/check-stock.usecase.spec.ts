import Id from "../../../../@shared/domain/value-object/id.value-object";
import Product from "../../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

describe("Check Stock Use Case Test", () => {
  const MockRepository = () => {
    return {
      add: jest.fn(),
      find: jest.fn(),
    };
  };

  it("should check stock", async () => {
    const productRepository = MockRepository();
    const useCase = new CheckStockUseCase({productRepository})

    const findSpy = jest.spyOn(productRepository, "find").mockResolvedValue(new Product({
        id: new Id("1"),
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10
    }))

    const result = await useCase.execute({productId: "1"})

    expect(result).toBeDefined()
    expect(result.productId).toEqual("1")
    expect(result.stock).toEqual(10)
    expect(findSpy).toHaveBeenCalledWith("1")
});
});
