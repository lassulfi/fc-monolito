import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderClientModel from "./order-client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        client: {
          id: order.client.id.id,
          name: order.client.name,
          email: order.client.email,
          address: order.client.address,
          createdAt: order.client.createdAt,
          updatedAt: order.client.updatedAt,
          orderId: order.id.id
        },
        products: order.products.map((product) => ({
          id: product.id.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          orderId: order.id.id,
        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        include: [
          { model: OrderClientModel, as: "client" },
          { model: OrderProductModel, as: "products" },
        ],
      }
    );
  }
  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id },
      include: [
        { model: OrderClientModel, as: "client" },
        { model: OrderProductModel, as: "products" },
      ],
    });

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        address: order.client.address,
        createdAt: order.client.createdAt,
        updatedAt: order.client.updatedAt,
      }),
      products: order.products.map(
        (product) =>
          new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          })
      ),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }
}
