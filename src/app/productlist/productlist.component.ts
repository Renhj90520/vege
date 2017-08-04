import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { CategoryService } from './category.service';
import { Router } from '@angular/router';
import { MathUtil } from '../shared/util';
import { AuthGuard } from '../shared/authguard';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [ProductService, CategoryService, AuthGuard]
})
export class ProductlistComponent implements OnInit {
  constructor(private router: Router, private productService: ProductService, private categoryService: CategoryService) { }

  products: any[] = [];
  categories: any[] = [];
  productsIncart: any[] = [];
  ngOnInit() {
    this.productsIncart = JSON.parse(sessionStorage.getItem('cartproducts')) || [];

    this.categoryService.getAllCategories()
      .subscribe(res => {
        if (res.body.length > 0) {
          this.categories = res.body;
          this.productService.getAllProduct(null, null, null, this.categories[0].Id, 1)
            .subscribe(resInner => {
              if (resInner.state === 1) {
                this.products = resInner.body.items;
                this.products.forEach(p => {
                  p.Count = 0;
                });
                if (this.productsIncart.length > 0) {
                  this.productsIncart.forEach((pc, index) => {
                    const pp = this.products.find(pi => pi.Id === pc.Id);
                    if (pp) {
                      const pic = this.productsIncart[index];
                      pp.Count = pic.Count;
                      this.productsIncart[index] = pp;
                    }
                  });
                }
              }
            });
        }
      });
  }

  onCategoryClick(categoryid) {
    this.productService.getAllProduct(null, null, null, categoryid, 1)
      .subscribe(res => {
        if (res.state === 1) {
          this.products = res.body.items;
          this.products.forEach(p => {
            p.Count = 0;
            if (this.productsIncart.length > 0) {
              this.productsIncart.forEach((pc, index) => {
                let pp = this.products.find(pi => pi.Id === pc.Id);
                if (pp) {
                  let pic = this.productsIncart[index];
                  pp.Count = pic.Count;
                  this.productsIncart[index] = pp;
                }
              });
            }
          });
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  onDecrease(product) {
    product.Count = MathUtil.subtraction(product.Count, product.Step);
    if (parseFloat(product.Count) <= 0) {
      product.Count = 0;
      const index = this.productsIncart.findIndex(p => { return p.Id === product.Id; }); // this.productsIncart.indexOf(product);
      if (index >= 0) {
        this.productsIncart.splice(index, 1);
      }
    }

    if (this.productsIncart.length > 0) {
      sessionStorage.setItem('cartproducts', JSON.stringify(this.productsIncart));
    } else {
      sessionStorage.removeItem('cartproducts')
    }
  }

  onIncrease(product) {
    product.Count = MathUtil.add(product.Count, product.Step);
    if (this.productsIncart.indexOf(product) < 0) {
      this.productsIncart.push(product);
    }
    // let pincart = this.productsIncart.find(p => p.id == product.id);
    // if (pincart) {
    //   pincart.count += product.count;
    // } else {
    //   this.productsIncart.push(product);
    // }
    if (this.productsIncart.length > 0) {
      sessionStorage.setItem('cartproducts', JSON.stringify(this.productsIncart));
    }
  }
  gotoOrder() {
    if (this.productsIncart.length > 0) {
      sessionStorage.setItem('cartproducts', JSON.stringify(this.productsIncart));
      this.router.navigate(['order/#'], { replaceUrl: true });
    } else {
      alert('未选择任何商品！');
    }
  }
}
