import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { ProductService } from '../product/product.service';
import { MathUtil } from '../shared/util';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService, ProductService]
})
export class CartComponent implements OnInit {

  constructor(private router: Router,
    private cartService: CartService,
    private productService: ProductService) { }

  message: string;
  state: number;
  products: any[] = [];

  suggestions: any[] = [];
  totalCost: number = 0;

  ngOnInit() {
    // this.cartService.getAllInCart().subscribe(res => {
    //   this.message = res.message;
    //   this.state = res.state;
    //   this.products = res.body || [];
    //   if (this.products.length <= 0) {
    //     this.productService.getAllProduct(null, 1, 10, null)
    //       .subscribe(res => {
    //         this.suggestions = res.body.items || [];
    //       })
    //   } else {
    //     this.totalCost = this.products.map(p => p.price * p.count).reduce((x, y) => x + y);
    //   }
    // });

    this.products = JSON.parse(sessionStorage.getItem("cartproducts")) || [];
    if (this.products.length <= 0) {
      this.productService.getAllProduct(null, 1, 10, null)
        .subscribe(res => {
          this.suggestions = res.body.items || [];
        })
    } else {
      this.products.forEach(p => p.cost = MathUtil.mutiple(p.count, p.price));
      this.totalCost = this.products.map(p => MathUtil.mutiple(p.count, p.price)).reduce((x, y) => MathUtil.add(x, y));
    }
  }

  gotoOrder() {
    sessionStorage.setItem("cartproducts", JSON.stringify(this.products));
    this.router.navigate(['order'], { replaceUrl: true });
  }

  onIncrease(product) {
    product.count = MathUtil.add(product.count, product.step);
    product.cost = MathUtil.mutiple(product.count, product.price);
    console.log('count' + product.count + 'price' + product.price + 'cost' + product.cost);
    this.totalCost = this.products.map(p => MathUtil.mutiple(p.count, p.price)).reduce((x, y) => MathUtil.add(x, y));
    sessionStorage.setItem("cartproducts", JSON.stringify(this.products));
  }

  onDecrease(product) {
    product.count = MathUtil.subtraction(product.count, product.step);
    if (product.count < 0) {
      product.count = 0;
    }
    product.cost = MathUtil.mutiple(product.count, product.price);
    console.log('count' + product.count + 'price' + product.price + 'cost' + product.cost);
    this.totalCost = this.products.map(p => MathUtil.mutiple(p.price, p.count)).reduce((x, y) => MathUtil.add(x, y));
    sessionStorage.setItem("cartproducts", JSON.stringify(this.products));
  }
}
