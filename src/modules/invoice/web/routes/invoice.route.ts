import express, { Request, Response } from "express";
import FindInvoiceUseCase from "../../usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../repository/invoice.repository";

export const invoiceRoute = express.Router()

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id

    const invoiceUseCase = new FindInvoiceUseCase({
        invoiceRepository: new InvoiceRepository()
    })
    
    try {
        const output = await invoiceUseCase.execute({ id })

        res.status(200).send(output)
    } catch (error) {
        res.status(500).send(error)
    }  
})