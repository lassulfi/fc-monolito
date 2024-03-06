import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
    async findAll(): Promise<Product[]> {
        const products = await ProductModel.findAll();

        return products.map(product => new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }))
    }
    async find(id: string): Promise<Product> {
        const model = await ProductModel.findOne({
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