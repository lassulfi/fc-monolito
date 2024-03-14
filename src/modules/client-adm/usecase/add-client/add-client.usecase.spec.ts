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
            address: "Rua dos Bobos, 0"
        }

        const result = await useCase.execute(input)

        expect(addSpy).toHaveBeenCalled()
        expect(result).toBeDefined()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.email).toEqual(input.email)
        expect(result.address).toEqual(input.address)
    })
})