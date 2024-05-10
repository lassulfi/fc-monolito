import { Sequelize } from "sequelize"
import { migrator } from "./migrator"
import { join } from "path"

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, "../../../database.sqlite"),
    logging: false,
})

migrator(sequelize).runAsCLI()