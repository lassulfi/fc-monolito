import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Product 1 description",
    salesPrice: 100
})

const MockRepository = () => ({
    find: jest.fn(),
    findAll: jest.fn(),
})

describe("Find Product Use Case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();

        const findSpy = jest.spyOn(productRepository, "find").mockResolvedValue(product);

        const useCase = new FindProductUseCase({productRepository});

        const input = {
            id: product.id.id
        }

        const result = await useCase.execute(input)

        expect(findSpy).toHaveBeenCalledWith(input.id);
        expect(result).toBeDefined()
        expect(result.id).toBe(product.id.id)
        expect(result.name).toBe(product.name)
        expect(result.description).toBe(product.description)
        expect(result.salesPrice).toBe(product.salesPrice)
    })
})