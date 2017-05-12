import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
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

  result: any;
  productInCart: any[] = [];
  count: number = 1;
  ngOnInit() {
    let id = this.route.params['id'];
    this.productService.getAllProduct(id)
      .subscribe(res => {
        this.result = res;
      });
    this.cartService.getAllInCart()
      .subscribe(pro => {
        this.productInCart = pro.body;
      });
  }

  onCartClick() {
    this.router.navigate(['cart'], { replaceUrl: true });
  }
  onAddCart() {
    let product = new Product(this.result.body.id, this.count);
    this.cartService.addToCart(product)
      .subscribe(res => {
        if (res.state == 1) {
          this.productInCart.push(product);
        }
      });
  }
}
