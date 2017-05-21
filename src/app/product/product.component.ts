import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { ProductService } from './product.service';
import { Result } from '../shared/result';
import { CartService } from '../cart/cart.service';
import { Product } from '../models/product';

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
  count: number = 1;
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.productService.getAllProduct(id)
        .subscribe(res => {
          this.product = res.body.items[0];
        });
    })

    this.cartService.getAllInCart()
      .subscribe(pro => {
        this.productInCart = pro.body || [];
      });
  }

  onCartClick() {
    this.router.navigate(['cart'], { replaceUrl: true });
  }
  onAddCart() {
    let product = new Product(this.product.id, this.count);
    this.cartService.addToCart(product)
      .subscribe(res => {
        if (res.state == 1) {
          if (!this.productInCart.some(p => p.productid == product.productid))
            this.productInCart.push(product);
        }
      });
  }
  onIncrease() {
    this.count++;
  }

  onDecrease() {
    this.count--;
    if (this.count < 1) {
      this.count = 1;
    }
  }
}
