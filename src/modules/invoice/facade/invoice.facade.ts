import UseCaseInterface from "../../@shared/use-case/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface InvoiceFacadeDeps {
    generateInvoiceUseCase: UseCaseInterface,
    findInvoiceUseCase: UseCaseInterface,
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private readonly _generateInvoiceUseCase: UseCaseInterface;
    private readonly _findInvoiceUseCase: UseCaseInterface;

    constructor({generateInvoiceUseCase, findInvoiceUseCase}: InvoiceFacadeDeps) {
        this._generateInvoiceUseCase = generateInvoiceUseCase;
        this._findInvoiceUseCase = findInvoiceUseCase;
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateInvoiceUseCase.execute(input)
    }

    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return await this._findInvoiceUseCase.execute(input)
    }
}