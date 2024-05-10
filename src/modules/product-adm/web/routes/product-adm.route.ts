import express, {Request, Response} from "express";
import AddProductUseCase from "../../usecase/add-product/add-product.usecase";
import ProductRepository from "../../repository/product.repository";
import { AddProductInputDTO } from "../../usecase/add-product/add-product.dto";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const addProductUseCase = new AddProductUseCase({
        productRepository: new ProductRepository()
    });

    try {
        const productDto: AddProductInputDTO = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        }

        const output = await addProductUseCase.execute(productDto);

        res.status(201).send(output)

    } catch (error) {
        res.status(500).send(error)
    }
})