import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'invoice_items',
    timestamps: false,
})
export default class InvoiceItemsModel extends Model {
    
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    price: number

    @Column({ allowNull: false })
    invoiceId: string

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
}