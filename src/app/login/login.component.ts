import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from './login.service';
import { authUrl } from '../shared/settings';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const openid = params['openid'];
      if (openid) {
        this.loginService.gettoken(openid)
          .subscribe(res => {
            if (res.state === 1) {
              sessionStorage.setItem('openid', openid);
              sessionStorage.setItem('token', res.body);
              this.router.navigate(['productlist'], { replaceUrl: true });
            } else {
              this.loginService.redirectAuth().subscribe()
            }
          }, err => {
            alert(err);
          });
      } else {
        this.loginService.redirectAuth().subscribe();
      }
    });
  }

}
