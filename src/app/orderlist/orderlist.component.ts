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
          let total = order.Products.map(p => MathUtil.mutiple(p.Price, p.Count)).reduce((x, y) => MathUtil.add(x, y));
          if (order.DeliveryCharge != 0) {
            order.total = MathUtil.add(total, order.DeliveryCharge);
          } else {
            order.total = total;
          }
        });
      });
  }
}
