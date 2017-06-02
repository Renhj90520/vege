import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from './address.service';
import { OrderService } from './order.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../models/product';
import { Address } from '../models/address';
import { MathUtil } from '../shared/util';

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
    private cartService: CartService) { }
  addresses: Address[] = [];
  products: any[];
  newAddr: Address = new Address();
  totalCost: number = 0;
  hasDelivery: boolean = false;
  ngOnInit() {
    this.addressService.getAllAddress()
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
    this.products = JSON.parse(sessionStorage.getItem("cartproducts")) || [];
    this.products.forEach(p => { p.cost = MathUtil.mutiple(p.count, p.price) });
    this.handleDelievery();
  }
  gotoOrders() {
    debugger;
    let address = this.addresses.filter(a => a.ischecked);
    if (address && address.length > 0) {
      let order = {
        // createtime: this.getNow(),
        deliveryCharge: 0,
        state: 0, addressId: address[0].id, products: this.products.map(p => {
          return { productId: p.id, count: p.count, price: p.price }
        })
      };
      if (this.hasDelivery) {
        order.deliveryCharge = 5;
      }
      debugger;
      this.orderService.addOrder(order, null)
        .subscribe(res => {
          debugger;
          if (res.state == 1) {
            this.router.navigate(['orderlist'], { replaceUrl: true });
            sessionStorage.removeItem('cartproducts');
          } else {
            alert(res.message);
          }
        }, err => {
          if (err) {
            alert(err);
          }
        })
    } else {
      alert('请填选地址');
    }

  }
  // getNow() {
  //   let now = new Date();
  //   let month = now.getMonth() < 10 ? '0' + now.getMonth() : now.getMonth();
  //   let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
  //   let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
  //   let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
  //   let seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
  //   return `${now.getFullYear()}\-${month}\-${day} ${hour}:${minute}:${seconds}`;
  // }
  onAddAddress() {
    this.addressService.addNewAddress(this.newAddr)
      .subscribe(res => {
        if (res.state == 1 && res.body) {
          this.addresses.forEach(a => a.ischecked = false);
          res.body.ischecked = true;
          this.addresses.push(res.body);
        }
      });
  }
  onIncrease(product) {
    product.count = MathUtil.add(product.count, product.step);
    product.cost = MathUtil.mutiple(product.count, product.price);

    this.handleDelievery();
    sessionStorage.setItem("cartproducts", JSON.stringify(this.products));
  }

  onDecrease(product) {
    product.count = MathUtil.subtraction(product.count, product.step);
    if (product.count < 0) {
      product.count = 0;
    }
    product.cost = MathUtil.mutiple(product.count, product.price);
    this.handleDelievery();
    sessionStorage.setItem("cartproducts", JSON.stringify(this.products));
  }

  onAddressChange(address) {
    this.addresses.forEach(a => a.ischecked = false);
    address.ischecked = true;
  }

  onAddrRemove(addr) {
    if (confirm('确认删除该地址吗？')) {
      this.addressService.deleteAddress(addr.id)
        .subscribe(res => {
          if (res.state == 1) {
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
    let total = this.products.map(p => MathUtil.mutiple(p.price, p.count)).reduce((x, y) => MathUtil.add(x, y));
    if (total < 20 && total > 0) {
      this.hasDelivery = true;
      this.totalCost = MathUtil.add(total, 5);
    } else {
      this.hasDelivery = false;
      this.totalCost = total;
    }
  }
}
