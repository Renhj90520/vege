import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
  providers: [ProductService]
})
export class ProductlistComponent implements OnInit {
  constructor(private productService: ProductService) { }

  result: any;
  ngOnInit() {
    this.productService.getAllProduct()
      .subscribe(res => {
        this.result = res;
      });
  }
}
