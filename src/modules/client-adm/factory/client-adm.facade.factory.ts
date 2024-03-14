import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {
    static create(): ClientAdmFacade {
        const clientRepository = new ClientRepository()
        const addClientUseCase = new AddClientUseCase({clientRepository})
        const findClientUseCase = new FindClientUseCase({clientRepository})

        return new ClientAdmFacade({addClientUseCase, findClientUseCase})
    }
}