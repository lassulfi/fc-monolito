import UseCaseInterface from "../../../@shared/use-case/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsOutputDto } from "./find-all-products.dto";

export interface FindAllProductsUseCaseDeps {
  productRepository: ProductGateway;
}

export default class FindAllProductsUseCase implements UseCaseInterface {
  private _productRepository: ProductGateway;

  constructor({ productRepository }: FindAllProductsUseCaseDeps) {
    this._productRepository = productRepository;
  }

  async execute(): Promise<FindAllProductsOutputDto> {
    const products = await this._productRepository.findAll();

    return {
      products: products.map(product => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
