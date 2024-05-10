import express, { Request, Response } from "express";
import AddClientUseCase from "../../usecase/add-client/add-client.usecase";
import ClientRepository from "../../repository/client.repository";

export const clientRoute = express.Router()

clientRoute.post("/", async(req: Request, res: Response) => {
    const addClientUseCase = new AddClientUseCase({
        clientRepository: new ClientRepository()
    })

    try {
        const clientDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode
        }

        
        const output = await addClientUseCase.execute(clientDto)
        
        res.status(201).send(output)
    } catch (error) {
        res.status(500).send(error)
    }
})