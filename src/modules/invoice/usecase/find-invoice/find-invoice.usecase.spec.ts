import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItems from "../../domain/invoice-items.entity"
import Invoice from "../../domain/invoice.entity"
import Address from "../../value-object/address.value-object"
import FindInvoiceUseCase from "./find-invoice.usecase"

const MockRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
})

describe("Find invoice use case test", () => {
    it("should retrieve an invoice", async () => {
        const invoiceRepository = MockRepository()
        const useCase = new FindInvoiceUseCase({invoiceRepository})

        const invoice = new Invoice({
            id: new Id("1"),
            name: "John Doe",
            document: "123456789",
            address: new Address({
                street: "Street 1",
                number: "123",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "12345-678"
            }),
            items: [new InvoiceItems({
                id: new Id("1"),
                name:  "Item 1",
                price: 100,
            })]
        })
        
        const findSpy = jest.spyOn(invoiceRepository, "find")
            .mockResolvedValue(invoice)

        const input = {
            id: "1"
        }

        const output = await useCase.execute(input)

        expect(findSpy).toHaveBeenCalledWith(input.id)
        expect(output.id).toBe(input.id)
        expect(output.name).toBe(invoice.name)
        expect(output.document).toBe(invoice.document)
        expect(output.address.street).toBe(invoice.address.street)
        expect(output.address.number).toBe(invoice.address.number)
        expect(output.address.complement).toBe(invoice.address.complement)
        expect(output.address.city).toBe(invoice.address.city)
        expect(output.address.state).toBe(invoice.address.state)
        expect(output.address.zipCode).toBe(invoice.address.zipCode)
        expect(output.items.length).toBe(1)
        expect(output.items[0].id).toBe(invoice.items[0].id.id)
        expect(output.items[0].name).toBe(invoice.items[0].name)
        expect(output.items[0].price).toBe(invoice.items[0].price)
        expect(output.total).toBe(invoice.total())
        expect(output.createdAt).toStrictEqual(invoice.createdAt)
    })
})