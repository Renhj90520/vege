import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order/order.service';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css'],
  providers: [OrderService],
})
export class OrderlistComponent implements OnInit {

  constructor(private orderService: OrderService) { }
  orders: any[];
  ngOnInit() {
    this.orderService.getAllOrders()
      .subscribe(res => {
        this.orders = res.body.items;
        console.log(JSON.stringify(this.orders));
        this.orders.forEach(order => {
          console.log(JSON.stringify(order));
          console.log(order.products.map(p => p.price * p.count))
          order.total = order.products.map(p => p.price * p.count).reduce((x, y) => x + y);
        });
        console.log(JSON.stringify(this.orders));
      });
  }

}
