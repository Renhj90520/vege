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
  hasDelivery: boolean = false;

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
    this.products = JSON.parse(sessionStorage.getItem('cartproducts')) || [];
    if (this.products.length <= 0) {
      this.productService.getAllProduct(null, 1, 10, null, 1)
        .subscribe(res => {
          this.suggestions = res.body.items || [];
        })
    } else {
      this.products.forEach(p => p.Cost = MathUtil.mutiple(p.Count, p.Price));
      this.handleDelievery();
      // this.totalCost = this.products.map(p => MathUtil.mutiple(p.count, p.price)).reduce((x, y) => MathUtil.add(x, y));
    }
  }

  gotoOrder() {
    sessionStorage.setItem('cartproducts', JSON.stringify(this.products));
    this.router.navigate(['order/#'], { replaceUrl: true });
  }

  onIncrease(product) {
    product.Count = MathUtil.add(product.Count, product.Step);
    product.Cost = MathUtil.mutiple(product.Count, product.Price);
    this.handleDelievery();
    // this.totalCost = this.products.map(p => MathUtil.mutiple(p.count, p.price)).reduce((x, y) => MathUtil.add(x, y));
    sessionStorage.setItem('cartproducts', JSON.stringify(this.products));
  }

  onDecrease(product) {
    product.Count = MathUtil.subtraction(product.Count, product.Step);
    if (product.Count < 0) {
      product.Count = 0;
    }
    product.Cost = MathUtil.mutiple(product.Count, product.Price);
    this.handleDelievery();
    // this.totalCost = this.products.map(p => MathUtil.mutiple(p.price, p.count)).reduce((x, y) => MathUtil.add(x, y));
    sessionStorage.setItem('cartproducts', JSON.stringify(this.products));
  }

  handleDelievery() {
    let total = this.products.map(p => MathUtil.mutiple(p.Price, p.Count)).reduce((x, y) => MathUtil.add(x, y));
    if (total < 20 && total > 0) {
      this.hasDelivery = true;
      this.totalCost = MathUtil.add(total, 5);
    } else {
      this.hasDelivery = false;
      this.totalCost = total;
    }
  }
}
