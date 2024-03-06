import UseCaseInterface from "../../../@shared/use-case/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";

export interface FindProductUseCaseDeps {
  productRepository: ProductGateway;
}

export default class FindProductUseCase implements UseCaseInterface {
  private _productRepository: ProductGateway;

  constructor({ productRepository }: FindProductUseCaseDeps) {
    this._productRepository = productRepository;
  }

  async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
    const { id } = input;
    const product = await this._productRepository.find(id);
    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
