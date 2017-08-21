import { HttpClient } from '../shared/httpclient';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { baseUrl } from '../shared/settings';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) { }

    getAllProduct(id?: number, index?: number, perPage?: number, category?: number, state?: number) {
        let url: string = baseUrl + 'products/';
        if (id) {
            url += id + '/';
        }

        const condition: string[] = [];
        if (index) {
            condition.push('index=' + index);
        }
        if (perPage) {
            condition.push('perPage=' + perPage);
        }
        if (category) {
            condition.push('category=' + category);
        }
        if (state) {
            condition.push('state=' + state);
        }

        if (condition.length > 0) {
            url += '?';
            url += condition.join('&');
        }
        return this.http.get(url)
            .map(res => res.json());
    }

    getProduct(id) {
        return this.http.get(baseUrl + 'products/' + id)
            .map(res => res.json());
    }
}
