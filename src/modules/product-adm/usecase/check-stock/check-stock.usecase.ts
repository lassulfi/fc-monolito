import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";

export interface CheckStockDeps {
    productRepository: ProductGateway
}

export default class CheckStockUseCase {
    private _productRepository: ProductGateway

    constructor ({
        productRepository
    }: CheckStockDeps) {
        this._productRepository = productRepository
    }

    async execute(input: CheckStockInputDto): Promise<CheckStockOutputDto> {
        const { productId } = input

        const { id, stock } = await this._productRepository.find(productId)

        return {
            productId: id.id,
            stock
        }
    }
}