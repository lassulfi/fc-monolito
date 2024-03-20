import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction";
import Id from "../../@shared/domain/value-object/id.value-object";
import TransactionRepository from "./transaction.repository";

describe("Transaction repository test", () => {
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

  it("should save a transaction", async () => {
    const transaction = new Transaction({
        id: new Id("1"),
        amount: 100,
        orderId: "1",
    })

    transaction.approve()

    const repository = new TransactionRepository()

    const result = await repository.save(transaction)

    expect(result.id).toBe(transaction.id)
    expect(result.amount).toBe(transaction.amount)
    expect(result.orderId).toBe(transaction.orderId)
    expect(result.status).toBe(transaction.status)
    expect(result.createdAt).toBe(transaction.createdAt)
    expect(result.updatedAt).toBe(transaction.updatedAt)

    const model = await TransactionModel.findOne({ where: { id: "1" } })

    expect(model.id).toBe(transaction.id.id)
    expect(model.amount).toBe(transaction.amount)
    expect(model.orderId).toBe(transaction.orderId)
    expect(model.status).toBe(transaction.status)
    expect(model.createdAt).toStrictEqual(transaction.createdAt)
    expect(model.updatedAt).toStrictEqual(transaction.updatedAt)
  })
});
