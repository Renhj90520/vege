import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductService } from './product.service';
import { Result } from '../shared/result';
// import { CartService } from '../cart/cart.service';
import { Product } from '../models/product';
import { MathUtil } from '../shared/util';
import { FavoriteService } from '../favoritelist/favorite.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService, FavoriteService]
})
export class ProductComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private favService: FavoriteService) { }

  product;
  productInCart: any[] = [];
  isFavorite: boolean = false;
  favorite;
  // count: number = 1;
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const id = +params['id'];
      this.productService.getAllProduct(id)
        .subscribe(res => {
          if (res.state === 1) {
            this.product = res.body.items[0];
            this.productInCart = JSON.parse(sessionStorage.getItem('cartproducts')) || [];
            const pp = this.productInCart.find(p => p.Id == this.product.Id);
            if (pp) {
              this.product.Count = pp.Count;
              const index = this.productInCart.indexOf(pp);
              this.productInCart[index] = this.product;
            } else {
              this.product.Count = this.product.Step;
            }
          } else {
            alert(res.message);
          }
        }, err => {
          alert(err);
        });
      const openid = sessionStorage.getItem('openid');
      this.favService.getFavorite(openid, id)
        .subscribe(res => {
          if (res.state === 1 && res.body.length > 0) {
            this.favorite = res.body[0];
            this.isFavorite = true;
          } else {
            this.isFavorite = false;
          }
        });
    });

    // this.cartService.getAllInCart()
    //   .subscribe(pro => {
    //     this.productInCart = pro.body || [];
    //   });

  }

  onCartClick() {
    sessionStorage.setItem('cartproducts', JSON.stringify(this.productInCart));
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
    const index = this.productInCart.indexOf(this.product);
    if (index < 0) {
      this.productInCart.push(this.product);
    } else {
      alert('该商品已加入购物车！');
    }
  }
  onIncrease() {
    this.product.Count = MathUtil.add(this.product.Count, this.product.Step);
  }

  onDecrease() {
    this.product.Count = MathUtil.subtraction(this.product.Count, this.product.Step);
    if (this.product.Count < this.product.Step) {
      this.product.Count = this.product.Step;
    }
  }
  addFav(id) {
    const openid = sessionStorage.getItem('openid');
    this.favService.addFavorite(openid, id)
      .subscribe(res => {
        if (res.state === 1) {
          this.isFavorite = true;
          this.favorite = res.body;
        }
      });
  }

  removeFav() {
    const openid = sessionStorage.getItem('openid');
    this.favService.deleteFavorite(this.favorite.FavId)
      .subscribe(res => {
        if (res.state === 1) {
          this.isFavorite = false;
        }
      });
  }
}
