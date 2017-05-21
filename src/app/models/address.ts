import { Product } from './product';
export class Address {
    constructor();
    constructor(id?: number, userId?: string, street?: string, name?: string, phone?: string) {
        this.id = id;
        this.userId = userId;
        this.street = street;
        this.name = name;
        this.phone = phone;
    }
    id?: number;
    userId?: string;
    street?: string;
    name?: string;
    phone?: string;
    public ischecked?: boolean = false;
    public products?: Product[];
}