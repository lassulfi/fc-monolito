import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto";



export default class AddClientUseCase {
    private _clientRepository: ClientGateway

    constructor({clientRepository}: {clientRepository: ClientGateway}) {
        this._clientRepository = clientRepository
    }

    async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
        const {id, name, email, address} = input
        const client = new Client({id: new Id(id), name, email, address})

        await this._clientRepository.add(client);

        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }

    }
}