import { Product } from './product';
export class Address {
    constructor();
    constructor(userId?: string, street?: string, name?: string, phone?: string) {
        this.userId = userId;
        this.street = street;
        this.name = name;
        this.phone = phone;
    }
    userId: string;
    street: string;
    name: string;
    phone: string;
    public ischecked: boolean = false;
    public products: Product[];
}