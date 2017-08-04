import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../order/order.service';
import { MathUtil } from '../shared/util';
import { PatchDoc } from 'app/models/patchdoc';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css'],
  providers: [OrderService],
})
export class OrderlistComponent implements OnInit {

  constructor(private orderService: OrderService, private ref: ChangeDetectorRef) { }
  orders: any[];
  ngOnInit() {
    let openid = sessionStorage.getItem('openid');
    if (!openid) {
      openid = 'test';
    }
    this.orderService.getAllOrders(openid)
      .subscribe(res => {
        if (res.state === 1) {
          this.orders = res.body.items || [];
          this.orders.forEach(order => {
            const total = order.Products.map(p => MathUtil.mutiple(p.Price, p.Count)).reduce((x, y) => MathUtil.add(x, y));
            if (order.DeliveryCharge !== 0) {
              order.total = MathUtil.add(total, order.DeliveryCharge);
            } else {
              order.total = total;
            }
          });
          this.ref.detectChanges();
        } else {
          alert(res.message);
        }
      }, err => { alert(err); });
  }
  onPay(order) {
    this.orderService.processPay(order.total, order.Id, order.State);
  }

  onCancel(order) {

    if (confirm('确定取消该订单吗?')) {
      const patchDocs = [];
      const stateDoc = new PatchDoc();
      stateDoc.path = '/State';
      stateDoc.value = 4;
      patchDocs.push(stateDoc);
      const reasonDoc = new PatchDoc();
      reasonDoc.path = '/CancelReason';
      reasonDoc.value = '用户取消';
      patchDocs.push(reasonDoc);
      const time = new PatchDoc();
      time.path = 'CancelTime';
      const now = new Date();
      time.value = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      patchDocs.push(time);
      this.orderService.updateOrder(order.Id, patchDocs)
        .subscribe(res => {
          if (res.state === 1) {
            const index = this.orders.indexOf(order);
            this.orders.splice(index, 1);
          } else {
            alert(res.message);
          }
        }, err => { alert(err); });
    }
  }
}
