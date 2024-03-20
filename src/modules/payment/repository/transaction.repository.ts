import Id from "../../@shared/domain/value-object/id.value-object";
import Transaction from "../domain/transaction";
import PaymentGateway from "../gateway/payment.gateway";
import TransactionModel from "./transaction.model";

export default class TransactionRepository implements PaymentGateway {

    async save(input: Transaction): Promise<Transaction> {
        const {id, orderId, amount, status, createdAt, updatedAt} = input

        await TransactionModel.create({
            id: id.id,
            orderId,
            amount,
            status,
            createdAt,
            updatedAt
        })

        return new Transaction({
            id,
            orderId,
            amount,
            status,
            createdAt,
            updatedAt
        })
    }

}