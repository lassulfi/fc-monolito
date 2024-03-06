import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findProductUseCase: FindProductUseCase;
    findAllProductsUseCase: FindAllProductsUseCase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
    private _findProductUseCase: FindProductUseCase;
    private _findAllProductsUseCase: FindAllProductsUseCase;
    
    constructor(useCaseProps: UseCaseProps) {
        this._findProductUseCase = useCaseProps.findProductUseCase
        this._findAllProductsUseCase = useCaseProps.findAllProductsUseCase
    }

    async find(input: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
        return await this._findProductUseCase.execute(input);      
    }
    async findAll(): Promise<FindAllStoreCatalogFacadeDto> {
        return await this._findAllProductsUseCase.execute();
    }
}