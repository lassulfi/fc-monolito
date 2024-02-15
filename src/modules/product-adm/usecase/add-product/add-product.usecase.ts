import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { AddProductInputDTO, AddProductOutputDTO } from "./add-product.dto";

export default class AddProductUseCase {
    private _productRepository: ProductGateway

    constructor({productRepository}: {productRepository: ProductGateway}) {
        this._productRepository = productRepository
    }

    async execute(input: AddProductInputDTO): Promise<AddProductOutputDTO> {
        const { id, name, description, purchasePrice, stock } = input
        
        const props = {
            id: new Id(id),
            name,
            description,
            purchasePrice,
            stock
        }

        const product = new Product(props)

        await this._productRepository.add(product)

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }
    }
}