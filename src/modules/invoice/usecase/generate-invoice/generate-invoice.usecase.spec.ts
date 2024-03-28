import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => ({
    save: jest.fn(),
    find: jest.fn()
})

describe("Generate invoice use case tests" , () => {
    it("should generate invoice", async () => {
        const invoiceRepository = MockRepository()

        const useCase = new GenerateInvoiceUseCase({invoiceRepository})

        const saveSpy = jest.spyOn(invoiceRepository, "save")

        const input = {
            name: "John Doe",
            document: "123456789",
            street: "Street 1",
            number: "123",
            complement: "Apartment 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345-678",
            items: [{
                id: "1",
                name: "Item 1",
                price: 100,
            }, {
                id: "2",
                name: "Item 2",
                price: 100,
            }]
        }

        const output = await useCase.execute(input)

        expect(saveSpy).toHaveBeenCalled()
        expect(output.id).toBeDefined()
        expect(output.name).toBe(input.name)
        expect(output.document).toBe(input.document)
        expect(output.street).toBe(input.street)
        expect(output.number).toBe(input.number)
        expect(output.complement).toBe(input.complement)
        expect(output.city).toBe(input.city)
        expect(output.state).toBe(input.state)
        expect(output.zipCode).toBe(input.zipCode)
        expect(output.items.length).toBe(2)
        expect(output.items[0].id).toBe(input.items[0].id)
        expect(output.items[0].name).toBe(input.items[0].name)
        expect(output.items[0].price).toBe(input.items[0].price)
        expect(output.items[1].id).toBe(input.items[1].id)
        expect(output.items[1].name).toBe(input.items[1].name)
        expect(output.items[1].price).toBe(input.items[1].price)
        expect(output.total).toBe(200)
    })
})