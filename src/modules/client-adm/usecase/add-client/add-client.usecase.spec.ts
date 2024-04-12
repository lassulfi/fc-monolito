import AddClientUseCase from "./add-client.usecase"

const MockRepository = () => ({
    add: jest.fn(),
    find: jest.fn()
})

describe("Add client use case unit test", () => {
    it("should add a client", async () => {
        const clientRepository = MockRepository()

        const useCase = new AddClientUseCase({clientRepository})

        const addSpy = jest.spyOn(clientRepository, "add")

        const input = {
            name: "John Doe",
            email: "j@d.com",
            document: "123456789",
            street:  "Rua dos Bobos",
            number: "0",
            complement: "Casa",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234567",
        }

        const result = await useCase.execute(input)

        expect(addSpy).toHaveBeenCalled()
        expect(result).toBeDefined()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.email).toEqual(input.email)
        expect(result.document).toEqual(input.document)
        expect(result.street).toEqual(input.street)
        expect(result.number).toEqual(input.number)
        expect(result.complement).toEqual(input.complement)
        expect(result.city).toEqual(input.city)
        expect(result.state).toEqual(input.state)
        expect(result.zipCode).toEqual(input.zipCode)
    })
})