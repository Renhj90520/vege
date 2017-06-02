import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';
import { Address } from '../models/address';

@Injectable()
export class OrderService {

    constructor(private http: Http) { }

    addOrder(order: any, openId?: string) {
        debugger;
        let url = baseUrl + "orders/";
        if (openId) {
            url + openId;
        }
        return this.http.post(url, order)
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