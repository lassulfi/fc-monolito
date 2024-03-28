import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Address from "../../value-object/address.value-object";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export type GenerateInvoiceUseCaseDeps = {
    invoiceRepository: InvoiceGateway;
}

export default class GenerateInvoiceUseCase {
    private _invoiceRepository: InvoiceGateway;

    constructor(deps: GenerateInvoiceUseCaseDeps) {
        const { invoiceRepository } = deps;
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const { id, name, document, street, number, complement, city, state, zipCode, items } = input;

        const invoice = new Invoice({
            id: new Id(id),
            name,
            document,
            address: new Address({
                street,
                number,
                complement,
                zipCode,
                city,
                state
            }),
            items: items.map(item => new InvoiceItems({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
            }))
        })

        await this._invoiceRepository.save(invoice)
        
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoice.total(),
        };
    }

}