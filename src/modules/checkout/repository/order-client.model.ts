import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "order_client",
    timestamps: false
})
export default class OrderClientModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    email: string

    @Column({ allowNull: false })
    address: string

    @Column({ allowNull: false })
    createdAt: Date;

    @Column({ allowNull: false })
    updatedAt: Date;

    @Column({ allowNull: false })
    orderId: string 
}