import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductStorageModel from "./product-storage.model";

export default class ProductStorageRepository implements ProductGateway {
    async findAll(): Promise<Product[]> {
        const products = await ProductStorageModel.findAll();

        return products.map(product => new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }))
    }
    async find(id: string): Promise<Product> {
        const model = await ProductStorageModel.findOne({
            where: { id }
        })

        return new Product({
            id: new Id(model.id),
            name: model.name,
            description: model.description,
            salesPrice: model.salesPrice,
        })
    }
}