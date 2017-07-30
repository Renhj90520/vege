import { Injectable } from '@angular/core';
import { baseUrl, authUrl } from '../shared/settings';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

    constructor(private http: Http) { }

    gettoken(openid) {
        return this.http.post(authUrl + 'gettoken', { openid: openid })
            .map(res => res.json());
    }

    redirectAuth() {
        return this.http.request(authUrl);
    }
}
