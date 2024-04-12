import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "./client.entity"
import Product from "./product.entity"

type OrderProps = {
    id?: Id
    client: Client
    products: Product[]
    status?: string
}

export default class Order extends BaseEntity {
    private _client: Client
    private _products: Product[]
    private _status: string

    constructor(props: OrderProps) {
        const { id, client, products, status } = props

        super({id})
        this._client = client
        this._products = products
        this._status = status || 'pending'
    }

    approved(): void {
        this._status = "approved"
    }

    get client(): Client {
        return this._client
    }

    get products(): Product[] {
        return this._products
    }

    get status(): string {
        return this._status
    }

    get total(): number {
        return this._products.reduce((acc, cur) => acc + cur.salesPrice, 0)
    }
}