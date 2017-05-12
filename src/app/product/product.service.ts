import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { baseUrl } from '../shared/settings';

@Injectable()
export class ProductService {
    constructor(private http: Http) { }

    getAllProduct(id?: string) {
        return this.http.get(baseUrl + "products/" + id)
            .map(res => res.json());
    }

}