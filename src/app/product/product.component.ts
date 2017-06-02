import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { ProductService } from './product.service';
import { Result } from '../shared/result';
import { CartService } from '../cart/cart.service';
import { Product } from '../models/product';
import { MathUtil } from '../shared/util';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService, CartService]
})
export class ProductComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService) { }

  product;
  productInCart: any[] = [];
  // count: number = 1;
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.productService.getAllProduct(id)
        .subscribe(res => {
          if (res.state == 1) {
            this.product = res.body.items[0];
            this.productInCart = JSON.parse(sessionStorage.getItem("cartproducts")) || [];
            let pp = this.productInCart.find(p => p.id == this.product.id);
            if (pp) {
              this.product.count = pp.count;
              let index = this.productInCart.indexOf(pp);
              this.productInCart[index] = this.product;
            } else {
              this.product.count = this.product.step;
            }
          } else {
            alert(res.message);
          }
        }, err => {
          alert(err);
        });
    });

    // this.cartService.getAllInCart()
    //   .subscribe(pro => {
    //     this.productInCart = pro.body || [];
    //   });

  }

  onCartClick() {
    sessionStorage.setItem("cartproducts", JSON.stringify(this.productInCart));
    this.router.navigate(['cart'], { replaceUrl: true });
  }
  onAddCart() {
    // this.cartService.addToCart(product)
    //   .subscribe(res => {
    //     if (res.state == 1) {
    //       if (!this.productInCart.some(p => p.productid == product.productid))
    //         this.productInCart.push(product);
    //     }
    //   });
    let index = this.productInCart.indexOf(this.product)
    if (index < 0) {
      this.productInCart.push(this.product);
    } else {
      alert('该商品已加入购物车！');
    }
  }
  onIncrease() {
    this.product.count = MathUtil.add(this.product.count, this.product.step);
  }

  onDecrease() {
    this.product.count = MathUtil.subtraction(this.product.count, this.product.step);
    if (this.product.count < this.product.step) {
      this.product.count = this.product.step;
    }
  }
}
