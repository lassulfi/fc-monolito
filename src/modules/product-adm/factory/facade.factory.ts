import ProductAdmFacade from "../facade/product-adm.facade";
import ProductAdmFacadeInterface from "../facade/product-adm.facade.interface";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";

export default class ProductAdmFacadeFactory {
    static create(): ProductAdmFacadeInterface {
        const productRepository = new ProductRepository();
        const addProductUseCase = new AddProductUseCase({
            productRepository
        })
        const checkStockUseCase = new CheckStockUseCase({
            productRepository
        })

        return new ProductAdmFacade({
            addProductUseCase,
            checkStockUseCase
        })
    }
}