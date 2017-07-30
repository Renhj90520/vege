import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/httpclient';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';
import { Address } from '../models/address';
import 'rxjs/add/operator/map';

@Injectable()
export class AddressService {

    constructor(private http: HttpClient) { }

    getAllAddress(openId?: string) {
        let url = baseUrl + 'addresses/';
        if (openId) {
            url += openId;
        }
        return this.http.get(url)
            .map(res => res.json());
    }

    addNewAddress(address: Address) {
        let url = baseUrl + 'addresses/';
        return this.http.post(url, address)
            .map(res => res.json());
    }

    deleteAddress(id: number) {
        const url = baseUrl + 'addresses/' + id;
        return this.http.delete(url)
            .map(res => res.json());
    }
}