import UseCaseInterface from "../../@shared/use-case/use-case.interface";
import ProductAdmFacadeInterface, { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.facade.interface";

export interface UseCaseProps {
    addProductUseCase: UseCaseInterface;
    checkStockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
    
    private _addProductUseCase: UseCaseInterface;
    private _checkStockUseCase: UseCaseInterface;

    constructor({
        addProductUseCase,
        checkStockUseCase
    }: UseCaseProps) {
        this._addProductUseCase = addProductUseCase
        this._checkStockUseCase = checkStockUseCase
    }
    
    addProduct(input: AddProductFacadeInputDto): Promise<void> {
        return this._addProductUseCase.execute(input);
    }
    checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
        return this._checkStockUseCase.execute(input);
    }

}