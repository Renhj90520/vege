import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order/order.service';
import { OrderStatePipe } from '../shared/orderstate.pipe';

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
        this.orders = res.body;
      });
  }

}
