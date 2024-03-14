import Id from "../value-object/id.value-object";

export type BaseEntityProps = {
    id?: Id,
    createdAt?: Date,
    updatedAt?: Date,
}

export default class BaseEntity {
    private _id: Id;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: BaseEntityProps) {
        const { id, createdAt, updatedAt } = props;
        this._id = id || new Id();
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();
    }

    get id(): Id {
        return this._id
    }

    get createdAt(): Date {
        return this._createdAt
    }

    get updatedAt(): Date {
        return this._updatedAt
    }

    set updatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt
    }
}