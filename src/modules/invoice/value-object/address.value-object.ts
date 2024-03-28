import ValueObject from "../../@shared/domain/value-object/value-object.interface";

export type AddressProps = {
    street: string,
    number: string,
    complement: string,
    zipCode: string,
    city: string,
    state: string,
}

export default class Address implements ValueObject {
    private _street: string
    private _number: string
    private _complement: string
    private _zipCode: string
    private _city: string
    private _state: string
    private _country: string

    constructor(props: AddressProps) {
        const { street, number, complement, zipCode, city, state } = props
        this._street = street
        this._number = number
        this._complement = complement
        this._zipCode = zipCode
        this._city = city
        this._state = state
    }

    get street(): string {
        return this._street
    }

    get number(): string {
        return this._number
    }

    get complement(): string {
        return this._complement
    }

    get zipCode(): string {
        return this._zipCode
    }

    get city(): string {
        return this._city
    }

    get state(): string {
        return this._state
    }

    get country(): string {
        return this._country
    }
}