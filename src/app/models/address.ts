import { Product } from './product';
export class Address {
    constructor();
    constructor(id?: number, openId?: string, street?: string, name?: string, phone?: string) {
        this.Id = id;
        this.OpenId = openId;
        this.Street = street;
        this.Name = name;
        this.Phone = phone;
    }
    Id?: number;
    OpenId?: string;
    Street?: string;
    Name?: string;
    Phone?: string;
    public ischecked?: boolean = false;
    public products?: Product[];
}