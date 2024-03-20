import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "./payment.facade";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

describe("Payment facade tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a transaction", async () => {
    const facade = PaymentFacadeFactory.create()

    const result = await facade.process({
        orderId: "1",
        amount: 100,
    })

    expect(result).toBeDefined()
    expect(result.transactionId).toBeDefined()
    expect(result.orderId).toBe("1")
    expect(result.amount).toBe(100)
    expect(result.status).toBe("approved")
    expect(result.createdAt).toBeDefined()
    expect(result.updatedAt).toBeDefined()
  });
});
