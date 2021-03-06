import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from './address.service';
import { OrderService } from './order.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../models/product';
import { Address } from '../models/address';
import { MathUtil } from '../shared/util';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [OrderService, AddressService, CartService]
})
export class OrderComponent implements OnInit {

  constructor(private router: Router,
    private orderService: OrderService,
    private addressService: AddressService,
    private cartService: CartService,
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any) { }
  addresses: Address[] = [];
  products: any[];
  newAddr: Address = new Address();
  totalCost: number = 0;
  hasDelivery: boolean = false;
  issubmitting: boolean = false;
  ngOnInit() {
    this.document.body.scrollTop = 0;
    const openid = sessionStorage.getItem('openid');
    this.addressService.getAllAddress(openid)
      .subscribe(res => {
        this.addresses = res.body;
        if (this.addresses && this.addresses.length > 0) {
          this.addresses[0].ischecked = true;
        }
      });

    // this.cartService.getAllInCart()
    //   .subscribe(res => {
    //     this.products = res.body;
    //   });
    this.products = JSON.parse(sessionStorage.getItem('cartproducts')) || [];
    this.products.forEach(p => { p.Cost = MathUtil.mutiple(p.Count, p.Price); });
    this.handleDelievery();
  }
  gotoOrders() {
    const address = this.addresses.filter(a => a.ischecked);
    if (address && address.length > 0) {
      if (!this.issubmitting) {
        const openid = sessionStorage.getItem('openid');
        const order = {
          // createtime: this.getNow(),
          DeliveryCharge: 0,
          State: 0, AddressId: address[0].Id, OpenId: openid, products: this.products.map(p => {
            return { ProductId: p.Id, Count: p.Count, Price: p.Price }
          })
        };
        if (this.hasDelivery) {
          order.DeliveryCharge = 5;
        }
        this.issubmitting = true;
        this.orderService.addOrder(order, null)
          .subscribe(res => {
            if (res.state === 1) {
              // this.router.navigate(['orderlist'], { replaceUrl: true });
              sessionStorage.removeItem('cartproducts');
              const newOrder = res.body;

              this.orderService.processPay(this.totalCost, newOrder.Id, newOrder.State);
            } else {
              alert(res.message);
            }
          }, err => {
            if (err) {
              alert(err);
            }

          });
      }
    } else {
      alert('请填选地址');
    }
  }

  onAddAddress() {
    const openid = sessionStorage.getItem('openid');
    this.newAddr.OpenId = openid;
    this.addressService.addNewAddress(this.newAddr)
      .subscribe(res => {
        if (res.state === 1 && res.body) {
          this.addresses.forEach(a => a.ischecked = false);
          res.body.ischecked = true;
          this.addresses.push(res.body);
          this.ref.detectChanges();
        } else {
          alert(res.message);
        }
      }, err => {
        alert(err);
      });
  }
  onIncrease(product) {
    product.Count = MathUtil.add(product.Count, product.Step);
    product.Cost = MathUtil.mutiple(product.Count, product.Price);

    this.handleDelievery();
    sessionStorage.setItem('cartproducts', JSON.stringify(this.products));
  }

  onDecrease(product) {
    product.Count = MathUtil.subtraction(product.Count, product.Step);
    if (parseFloat(product.Count) <= 0) {
      product.Count = 0;
      const index = this.products.findIndex(p => { return p.Id === product.Id; });
      if (index >= 0) {
        this.products.splice(index, 0);
      }
    } else {
      product.Cost = MathUtil.mutiple(product.Count, product.Price);
      this.handleDelievery();
    }

    sessionStorage.setItem('cartproducts', JSON.stringify(this.products));
  }

  onAddressChange(address) {
    this.addresses.forEach(a => a.ischecked = false);
    address.ischecked = true;
  }

  onAddrRemove(addr) {
    if (confirm('确认删除该地址吗？')) {
      this.addressService.deleteAddress(addr.Id)
        .subscribe(res => {
          if (res.state === 1) {
            this.addresses.splice(this.addresses.indexOf(addr), 1);
          } else {
            alert(res.message);
          }
        }, err => {
          alert(err);
        });
    }
  }
  handleDelievery() {
    const total = this.products.map(p => MathUtil.mutiple(p.Price, p.Count)).reduce((x, y) => MathUtil.add(x, y));
    if (total < 20 && total > 0) {
      this.hasDelivery = true;
      this.totalCost = MathUtil.add(total, 5);
    } else {
      this.hasDelivery = false;
      this.totalCost = total;
    }
  }

}
