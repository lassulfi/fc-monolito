import express, { Express } from "express"
import { Sequelize } from "sequelize-typescript"
import ClientModel from "../../client-adm/repository/client.model"
import InvoiceModel from "../../invoice/repository/invoice.model"
import InvoiceItemsModel from "../../invoice/repository/invoice-items.model"
import TransactionModel from "../../payment/repository/transaction.model"
import ProductModel from "../../product-adm/repository/product.model"
import ProductStorageModel from "../../store-catalog/repository/product-storage.model"
import { migrator } from "../../../config/migrator/migrator"
import { Umzug } from "umzug"
import { clientRoute } from "../../client-adm/web/routes/client-adm.route"
import { productRoute } from "../../product-adm/web/routes/product-adm.route"
import { checkoutRoute } from "../../checkout/web/routes/checkout.route"
import { invoiceRoute } from "../../invoice/web/routes/invoice.route"

export const app: Express = express()
app.use(express.json())
app.use("/clients", clientRoute)
app.use("/products", productRoute)
app.use("/checkout", checkoutRoute)
app.use("/invoices", invoiceRoute)

export let sequelize: Sequelize

export let migration: Umzug<any>

async function setupDb() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    })

    await sequelize.addModels([ClientModel, InvoiceModel, InvoiceItemsModel, TransactionModel, ProductModel, ProductStorageModel])
    migration = migrator(sequelize);
    await migration.up();
}

setupDb()