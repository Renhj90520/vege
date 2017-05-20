import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { baseUrl } from '../shared/settings';

@Injectable()
export class ProductService {
    constructor(private http: Http) { }

    getAllProduct(id?: number, index?: number, perPage?: number, category?: number) {
        let url: string = baseUrl + "products/";
        if (id) {
            url += id + '/';
        }

        var condition: string[] = [];
        if (index) {
            condition.push('index=' + index);
        }
        if (perPage) {
            condition.push('perPage=' + perPage);
        }
        if (category) {
            condition.push('category=' + category);
        }

        if (condition.length > 0) {
            url += '?';
            url += condition.join('&');
        }
        return this.http.get(url)
            .map(res => res.json());
    }

}