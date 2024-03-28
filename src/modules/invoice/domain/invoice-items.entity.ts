import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

export type InvoiceItemsProps = {
    id?: Id
    name: string
    price: number
    createdAt?: Date
    updatedAt?: Date
}

export default class InvoiceItems extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _price: number;


    constructor(props: InvoiceItemsProps) {
        const { id, name, price, createdAt, updatedAt } = props
        super({id, createdAt, updatedAt})
        this._name = name
        this._price = price
    } 

    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price
    }
}