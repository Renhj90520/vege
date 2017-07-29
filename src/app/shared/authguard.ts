import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonUtil } from './util';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private route: Router) {

    }
    canActivate() {
        const user = CommonUtil.getToken();
        if (user) {
            return true;
        } else {
            this.route.navigate(['/login']);
            return false;
        }
        // return true;
    }
}