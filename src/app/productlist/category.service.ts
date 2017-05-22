import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { baseUrl } from '../shared/settings';

@Injectable()
export class CategoryService {
    constructor(private http: Http) { }

    getAllCategories() {
        return this.http.get(baseUrl + "categories")
            .map(res => res.json());
    }
}