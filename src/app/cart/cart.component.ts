import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { ProductService } from '../product/product.service';

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
    this.cartService.getAllInCart().subscribe(res => {
      console.log('-------------->cart ' + JSON.stringify(res));
      this.message = res.message;
      this.state = res.state;
      this.products = res.body || [];
      if (this.products.length <= 0) {
        this.productService.getAllProduct(null, 1, 10, null)
          .subscribe(res => {
            this.suggestions = res.body.items || [];
          })
      } else {
        this.totalCost = this.products.map(p => p.price * p.count).reduce((x, y) => x + y);
      }
    });
  }

  gotoOrder() {
    this.router.navigate(['order'], { replaceUrl: true });
  }

  onIncrease(product) {
    product.count++;
    this.totalCost = this.products.map(p => p.price * p.count).reduce((x, y) => x + y);
  }

  onDecrease(product) {
    product.count--;
    if (product.count < 0) {
      product.count = 0;
    }
    this.totalCost = this.products.map(p => p.price * p.count).reduce((x, y) => x + y);
  }
}
