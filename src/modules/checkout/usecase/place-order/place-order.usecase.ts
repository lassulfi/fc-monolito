import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/use-case/use-case.interface";
import ClientFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export type PlaceOrderUseCaseDeps = {
  clientFacade: ClientFacadeInterface;
  productFacade: ProductAdmFacadeInterface;
  catalogFacade: StoreCatalogFacadeInterface;
  checkoutRepository: CheckoutGateway;
  invoiceFacade: InvoiceFacadeInterface;
  paymentFacade: PaymentFacadeInterface;
};

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _checkoutRepository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor({
    clientFacade,
    productFacade,
    catalogFacade,
    checkoutRepository,
    invoiceFacade,
    paymentFacade,
  }: PlaceOrderUseCaseDeps) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._checkoutRepository = checkoutRepository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const { clientId, products } = input;

    const client = await this._clientFacade.find({ id: clientId });
    if (!client) {
      throw new Error(`Client ID [${clientId}] not found `);
    }

    await this.validateProducts(products);
    
    const retrievedProducts = await Promise.all(
      products.map((product) => this.getProduct(product.productId))
    );

    const currentClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.street,
    });

    const order = new Order({
      client: currentClient,
      products: retrievedProducts,
    });

    const payment = await this._paymentFacade.process({
        orderId: order.id.id,
        amount: order.total,
    })

    const invoice = payment.status === "approved"
        ? await this._invoiceFacade.generate({ 
            name: client.name, 
            document: client.document,
            street: client.street,
            number: client.number,
            city: client.city,
            complement: client.complement,
            state: client.state,
            zipCode: client.zipCode,
            items: retrievedProducts.map(product => ({
                id: product.id.id,
                name: product.name,
                price: product.salesPrice,
            }))
        })
        :  null;

    payment.status === "approved" && order.approved()
    this._checkoutRepository.addOrder(order)

    return {
        id: order.id.id,
        invoiceId: payment.status === "approved" ? invoice.id : null,
        status: payment.status,
        total: order.total,
        products: order.products.map(product => ({
            productId: product.id.id
        }))
    };
  }

  private async validateProducts(
    products: { productId: string }[]
  ): Promise<void> {
    if (products.length === 0) {
      throw new Error("No products selected");
    }

    for (const product of products) {
      const actualProduct = await this._productFacade.checkStock({
        productId: product.productId,
      });

      if (actualProduct.stock <= 0) {
        throw new Error(
          `Product ID [${product.productId}] is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });

    if (!product) {
      throw new Error(`Product ID [${productId}] not found`);
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
