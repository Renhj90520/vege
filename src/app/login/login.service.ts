import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/httpclient';
import { baseUrl, authUrl } from '../shared/settings';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }

    gettoken(openid) {
        return this.http.post(authUrl + 'gettoken', { openid: openid || '123456' })//TODO
            .map(res => res.json());
    }

    redirectAuth() {
        return this.http.get(authUrl).map(res => res.json());
    }
}