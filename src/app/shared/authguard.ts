import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonUtil } from './util';
import { authUrl } from './settings';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private route: Router, private http: Http) {

    }
    canActivate() {
        return this.checkOpeningTime();
        // return true;
    }
    checkOpeningTime() {
        return this.http.get(authUrl + 'checktime')
            .map(res => {
                const result = res.json();
                if (result.state === 1) {

                    if (result.body == true) {
                        const user = CommonUtil.getToken();
                        if (user) {
                            return true;
                        } else {
                            this.route.navigate(['login']);
                            return false;
                        }
                    } else {
                        alert('非营业时间！');
                        this.route.navigate(['closed']);
                        return false;
                    }
                } else {
                    alert(result.message);
                    return false;
                }
            });
    }
}