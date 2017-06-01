import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order/order.service';
import { MathUtil } from '../shared/util';

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
        this.orders.forEach(order => {
          order.total = order.products.map(p => MathUtil.mutiple(p.price, p.count)).reduce((x, y) => MathUtil.add(x, y));
        });
      });
  }

}
