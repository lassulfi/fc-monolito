import express, { Request, Response } from "express";
import PlaceOrderUseCase from "../../usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "../../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../../payment/factory/payment.facade.factory";
import { PlaceOrderInputDto } from "../../usecase/place-order/place-order.dto";
import OrderRepository from "../../repository/order.repository";

export const checkoutRoute = express.Router()

checkoutRoute.post("/", async (req: Request, res: Response) => {
    const placeOrderUseCase = new PlaceOrderUseCase({
        clientFacade: ClientAdmFacadeFactory.create(),
        productFacade: ProductAdmFacadeFactory.create(),
        catalogFacade: StoreCatalogFacadeFactory.create(),
        checkoutRepository: new OrderRepository(),
        invoiceFacade: InvoiceFacadeFactory.create(),
        paymentFacade: PaymentFacadeFactory.create()
    })

    try {
        const input: PlaceOrderInputDto = {
            clientId: req.body.clientId,
            products: req.body.products
        }

        const output = await placeOrderUseCase.execute(input)

        res.status(201).send(output)
    } catch (error) {
        res.status(500).send(error)
    }
})