import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import FindClientUseCase from "./find-client.usecase"

const MockRepository = () => ({
    add: jest.fn(),
    find: jest.fn()
})

const client = new Client({
    id: new Id("1"),
    name: "Client 1",
    email: "c@c.com",
    document: "123",
    street: "Street 1",
    number: "1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "ZipCode 1"
})

describe("Find client use case unit test", () => {
    it("should find a client", async () => {
        const clientRepository = MockRepository()

        const findSpy = jest.spyOn(clientRepository, "find")
            .mockResolvedValue(client);

        const input = {
            id: "1"
        }

        const useCase = new FindClientUseCase({clientRepository})
        const output = await useCase.execute(input)

        expect(findSpy).toHaveBeenCalledWith(input.id);

        expect(output.id).toEqual(client.id.id)
        expect(output.name).toEqual(client.name)
        expect(output.email).toEqual(client.email)
        expect(output.document).toEqual(client.document)
        expect(output.street).toEqual(client.street)
        expect(output.number).toEqual(client.number)
        expect(output.complement).toEqual(client.complement)
        expect(output.city).toEqual(client.city)
        expect(output.state).toEqual(client.state)
        expect(output.zipCode).toEqual(client.zipCode)
        expect(output.createdAt).toEqual(client.createdAt)
        expect(output.updatedAt).toEqual(client.updatedAt)
    })
})