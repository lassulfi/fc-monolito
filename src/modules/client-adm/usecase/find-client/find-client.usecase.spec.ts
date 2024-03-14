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
    address: "Address 1"
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
        expect(output.address).toEqual(client.address)
        expect(output.createdAt).toEqual(client.createdAt)
        expect(output.updatedAt).toEqual(client.updatedAt)
    })
})