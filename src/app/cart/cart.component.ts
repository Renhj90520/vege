import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService]
})
export class CartComponent implements OnInit {

  constructor(private router: Router,
    private cartService: CartService) { }

  message: string;
  state: number;
  products: any[] = [];

  ngOnInit() {
    this.cartService.getAllInCart().subscribe(res => {
      this.message = res.message;
      this.state = res.state;
      this.products = res.body;
    });
  }

  gotoOrder() {
    this.router.navigate(['order'], { replaceUrl: true });
  }

  onIncrease(product) {
    product.count++;
  }

  onDecrease(product) {
    product.count--;
    if (product.count < 0) {
      product.count = 0;
    }
  }
}
