import { HttpClient } from '../shared/httpclient';
import { Injectable } from '@angular/core';
import { baseUrl } from '../shared/settings';
import 'rxjs/add/operator/map';

@Injectable()
export class FavoriteService {
    constructor(private http: HttpClient) { }

    getFavorite(openid, productid?) {
        let url = baseUrl + 'favorites/';
        if (openid) {
            url += openid;
        }
        if (productid) {
            url += '/' + productid;
        }

        return this.http.get(url).map(
            res => res.json()
        );
    }

    addFavorite(openid, productid) {
        return this.http.post(baseUrl + 'favorites', { Openid: openid, ProductId: productid })
            .map(res => res.json());
    }

    deleteFavorite(id) {
        return this.http.delete(baseUrl + 'favorites/' + id)
            .map(res => res.json());
    }
}