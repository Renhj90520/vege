import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { baseUrl } from '../shared/settings';
import { Product } from '../models/product';
import 'rxjs/add/operator/map'

@Injectable()
export class CartService {
    constructor(private http: Http) { }

    addToCart(product: Product, openId?: string) {
        let url = baseUrl + "carts/";
        if (openId) {
            url + openId;
        }
        let headers: Headers = new Headers();
        headers.set("Content-Type", "application/json");
        return this.http.post(url, product)
            .map(res => res.json());
    }

    getAllInCart(openId?: string) {
        let url = baseUrl + "carts/";
        if (openId) {
            url + openId;
        }
        return this.http.get(url)
            .map(res => res.json());
    }
}