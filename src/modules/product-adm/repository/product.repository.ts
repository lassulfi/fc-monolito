import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    const {
      id,
      name,
      description,
      purchasePrice,
      stock,
      createdAt,
      updatedAt,
    } = product;

    await ProductModel.create({
      id: id.id,
      name,
      description,
      purchasePrice,
      stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async find(id: string): Promise<Product> {
    const model = await ProductModel.findOne({ where: { id } });

    if (!model) {
        throw new Error(`Product ID ${id} not found`)
    }

    const {
      id: productId,
      name,
      description,
      purchasePrice,
      stock,
      createdAt,
      updatedAt,
    } = model;

    return new Product({
      id: new Id(productId),
      name,
      description,
      purchasePrice,
      stock,
      createdAt,
      updatedAt,
    });

  }
}
