import Id from "../../../../@shared/domain/value-object/id.value-object";
import ProductGateway from "../../../gateway/product.gateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";

export interface CheckStockProps {
    productRepository: ProductGateway
}

export default class CheckStockUseCase {
    private _productRepository: ProductGateway

    constructor ({
        productRepository
    }: CheckStockProps) {
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