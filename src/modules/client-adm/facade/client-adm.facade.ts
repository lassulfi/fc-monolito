import UseCaseInterface from "../../@shared/use-case/use-case.interface";
import ClientFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export type ClientAdmFacadeDeps = {
    addClientUseCase: UseCaseInterface,
    findClientUseCase: UseCaseInterface
}

export default class ClientAdmFacade implements ClientFacadeInterface {
    private readonly _addClientUseCase: UseCaseInterface;
    private readonly _findClientUseCase: UseCaseInterface;

    constructor({addClientUseCase, findClientUseCase}: ClientAdmFacadeDeps) {
        this._addClientUseCase = addClientUseCase;
        this._findClientUseCase = findClientUseCase;
    }

    async add(input: AddClientFacadeInputDto): Promise<void> {
        await this._addClientUseCase.execute(input);
    }
    async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
        return await this._findClientUseCase.execute(input);
    }
}