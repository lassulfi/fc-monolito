import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export type ProcessPaymentUseCaseDeps = {
    transactionRepository: PaymentGateway;
}

export default class ProcessPaymentUseCase {
    private readonly _transactionRepository: PaymentGateway;

    constructor({ transactionRepository }: ProcessPaymentUseCaseDeps) {
        this._transactionRepository = transactionRepository;
    }

    async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
        const { amount, orderId } = input

        const transaction = new Transaction({
            orderId, 
            amount
        })
        transaction.process()

        const persistedTransaction = await this._transactionRepository.save(transaction)

        return {
            transactionId: persistedTransaction.id.id,
            orderId: persistedTransaction.orderId,
            amount: persistedTransaction.amount,
            status: persistedTransaction.status,
            createdAt: persistedTransaction.createdAt,
            updatedAt: persistedTransaction.updatedAt,
        }
    }
}