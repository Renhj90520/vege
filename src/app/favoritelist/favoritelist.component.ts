import { Component, OnInit } from '@angular/core';
import { FavoriteService } from './favorite.service';
import { MathUtil } from '../shared/util';

@Component({
  selector: 'app-favoritelist',
  templateUrl: './favoritelist.component.html',
  styleUrls: ['./favoritelist.component.css'],
  providers: [FavoriteService]
})
export class FavoritelistComponent implements OnInit {

  constructor(private favService: FavoriteService) { }
  favorites: any[] = [];
  productsIncart: any[] = [];
  ngOnInit() {
    this.productsIncart = JSON.parse(sessionStorage.getItem('cartproducts')) || [];
    let openid = sessionStorage.getItem('openid');
    this.favService.getFavorite(openid || '123')//TODO
      .subscribe(res => {
        if (res.state == 1) {
          this.favorites = res.body || [];
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  onDecrease(product) {
    product.count = MathUtil.subtraction(product.count, product.step);
    if (product.count < 0) {
      product.count = 0;
    }

    let index = this.productsIncart.indexOf(product);
    if (product.count == 0) {
      if (index >= 0) {
        this.productsIncart.splice(index, 1);
      }
    }
    if (this.productsIncart.length > 0)
      sessionStorage.setItem('cartproducts', JSON.stringify(this.productsIncart));
  }

  onIncrease(product) {
    product.count = MathUtil.add(product.count, product.step);
    if (this.productsIncart.indexOf(product) < 0) {
      this.productsIncart.push(product);
    }
    // let pincart = this.productsIncart.find(p => p.id == product.id);
    // if (pincart) {
    //   pincart.count += product.count;
    // } else {
    //   this.productsIncart.push(product);
    // }
    if (this.productsIncart.length > 0)
      sessionStorage.setItem('cartproducts', JSON.stringify(this.productsIncart));
  }
}
