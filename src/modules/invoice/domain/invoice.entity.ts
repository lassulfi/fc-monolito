import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address.value-object";
import InvoiceItems from "./invoice-items.entity";

export type InvoiceProps = {
    id?: Id
    name: string
    document: string
    address: Address
    items: InvoiceItems[]
    createdAt?: Date
    updatedAt?: Date
}

export default class Invoice extends BaseEntity implements AggregateRoot {
    private _name: string
    private _document: string
    private _address: Address
    private _items: InvoiceItems[]

    constructor(props: InvoiceProps) {
        const {id, name, document, address, items, createdAt, updatedAt} = props
        super({id, createdAt, updatedAt})
        this._name = name
        this._document = document
        this._address = address
        this._items = items
    }

    get name(): string {
        return this._name
    }

    get document(): string {
        return this._document
    }

    get address(): Address {
        return this._address
    }

    get items(): InvoiceItems[] {
        return this._items
    }

    total(): number {
        return this._items.reduce((acc, curr) => acc + curr.price, 0)
    }
}