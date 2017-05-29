import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { CategoryService } from './category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [ProductService, CategoryService]
})
export class ProductlistComponent implements OnInit {
  constructor(private router: Router, private productService: ProductService, private categoryService: CategoryService) { }

  products: any[] = [];
  categories: any[] = [];
  productsIncart: any[] = [];
  ngOnInit() {
    this.categoryService.getAllCategories()
      .subscribe(res => {
        if (res.body.length > 0) {
          this.categories = res.body;
          this.productService.getAllProduct(null, null, null, this.categories[0].id)
            .subscribe(res => {
              if (res.state == 1) {
                this.products = res.body.items;
                this.products.forEach(p => {
                  p.count = 0;
                });
              }
            });
        }
      });
  }

  onCategoryClick(categoryid) {
    this.productService.getAllProduct(null, null, null, categoryid)
      .subscribe(res => {
        if (res.state == 1) {
          this.products = res.body.items;
          this.products.forEach(p => {
            p.count = 0;
          })
        }
        else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }

  onDecrease(product) {
    product.count -= product.step;
    if (product.count < 0) {
      product.count = 0;
    }

    let index = this.productsIncart.indexOf(product);
    if (product.count == 0) {
      if (index >= 0) {
        this.productsIncart.splice(index, 1);
      }
    }
  }

  onIncrease(product) {
    product.count += product.step;
    if (this.productsIncart.indexOf(product) < 0) {
      this.productsIncart.push(product);
    }
  }
  gotoOrder() {
    if (this.productsIncart.length > 0) {
      sessionStorage.setItem('cartproducts', JSON.stringify(this.productsIncart));
      this.router.navigate(['order'], { replaceUrl: true });
    } else {
      alert("未选择任何商品！")
    }
  }
}
