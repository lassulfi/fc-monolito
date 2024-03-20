import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";


const createMockTransaction = () => ({
  approvedTransaction: () => new Transaction({
    id: new Id("1"),
    orderId: "1",
    amount: 100,
    status: "approved"
  }),
  rejectedTransaction: () => new Transaction({
    id: new Id("1"),
    orderId: "1",
    amount: 50,
    status: "declined"
  }),
})

const MockRepository = () => ({
  save: jest.fn(),
});

describe("Process payment use case test", () => {
  it("should approve a transaction", async () => {
    const transactionRepository = MockRepository();

    const useCase = new ProcessPaymentUseCase({ transactionRepository });

    const approvedTransaction = createMockTransaction().approvedTransaction()

    const saveSpy = jest.spyOn(transactionRepository, "save")
      .mockResolvedValue(approvedTransaction);

    const input = {
        orderId: "1",
        amount: 100
    }

    const result = await useCase.execute(input);

    expect(saveSpy).toHaveBeenCalled();

    expect(result).toBeDefined()
    expect(result.transactionId).toBe(approvedTransaction.id.id)
    expect(result.orderId).toBe(approvedTransaction.orderId)
    expect(result.amount).toBe(100)
    expect(result.status).toBe('approved')
    expect(result.createdAt).toBe(approvedTransaction.createdAt)
    expect(result.updatedAt).toBe(approvedTransaction.updatedAt)
  });

  it("should decline a transaction", async () => {
    const transactionRepository = MockRepository();

    const useCase = new ProcessPaymentUseCase({ transactionRepository });

    const rejectedTransaction = createMockTransaction().rejectedTransaction()

    const saveSpy = jest.spyOn(transactionRepository, "save")
      .mockResolvedValue(rejectedTransaction);

    const input = {
        orderId: "1",
        amount: 50
    }

    const result = await useCase.execute(input);

    expect(saveSpy).toHaveBeenCalled();

    expect(result).toBeDefined()
    expect(result.transactionId).toBe(rejectedTransaction.id.id)
    expect(result.orderId).toBe(rejectedTransaction.orderId)
    expect(result.amount).toBe(50)
    expect(result.status).toBe('declined')
    expect(result.createdAt).toBe(rejectedTransaction.createdAt)
    expect(result.updatedAt).toBe(rejectedTransaction.updatedAt)
  })
});
