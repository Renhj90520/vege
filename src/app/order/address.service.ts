import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';
import { Address } from '../models/address';
import 'rxjs/add/operator/map';

@Injectable()
export class AddressService {

    constructor(private http: Http) { }

    getAllAddress(openId?: string) {
        let url = baseUrl + "addresses/";
        if (openId) {
            url + openId;
        }
        return this.http.get(url)
            .map(res => res.json());
    }

    addNewAddress(address: Address, openId?: string) {
        let url = baseUrl + "addresses/";
        if (openId) {
            url + openId;
        }
        return this.http.post(url, address)
            .map(res => res.json());
    }
}