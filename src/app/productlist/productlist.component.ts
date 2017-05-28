import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [ProductService, CategoryService]
})
export class ProductlistComponent implements OnInit {
  constructor(private productService: ProductService, private categoryService: CategoryService) { }

  result: any;
  categories: any[] = [];
  ngOnInit() {
    this.categoryService.getAllCategories()
      .subscribe(res => {
        if (res.body.length > 0) {
          this.categories = res.body;
          this.productService.getAllProduct(null, null, null, this.categories[0])
            .subscribe(res => {
              this.result = res;
            });
        }
      });
  }

  onCategoryClick(categoryid) {
    this.productService.getAllProduct(null, null, null, categoryid)
      .subscribe(res => {
        if (res.state == 1) {
          this.result = res;
        }
        else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
}
