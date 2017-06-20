import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/httpclient';
import 'rxjs/add/operator/map';
import { baseUrl } from '../shared/settings';

@Injectable()
export class CategoryService {
    constructor(private http: HttpClient) { }

    getAllCategories() {
        return this.http.get(baseUrl + "categories")
            .map(res => res.json());
    }
}