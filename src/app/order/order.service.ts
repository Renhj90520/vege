import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';
import { Address } from '../models/address';

@Injectable()
export class OrderService {

    constructor(private http: Http) { }

    addOrder(address: Address, openId?: string) {
        let url = baseUrl + "orders/";
        if (openId) {
            url + openId;
        }
        return this.http.post(url, address)
            .map(res => res.json());
    }

    getAllOrders(openId?: string) {
        let url = baseUrl + "orders/";
        if (openId) {
            url + openId;
        }
        return this.http.get(url)
            .map(res => res.json());
    }
}