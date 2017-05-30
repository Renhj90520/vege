import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from './address.service';
import { OrderService } from './order.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../models/product';
import { Address } from '../models/address';

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
    this.totalCost = this.products.map(p => p.price * p.count).reduce((x, y) => x + y);
  }
  gotoOrders() {
    let address = this.addresses.filter(a => a.ischecked);
    if (address && address.length > 0) {
      let order = {
        createtime: this.getNow(),
        state: 0, addressId: address[0].id, products: this.products.map(p => {
          return { productid: p.id, count: p.count, price: p.price }
        })
      };
      this.orderService.addOrder(order, 'openid')
        .subscribe(res => {
          this.router.navigate(['orderlist'], { replaceUrl: true });
        }, err => {
          if (err) {
            alert(err);
          }
        })
    } else {
      alert('请填选地址');
    }

  }
  getNow() {
    let now = new Date();
    let month = now.getMonth() < 10 ? '0' + now.getMonth() : now.getMonth();
    let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    let seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return `${now.getFullYear()}\-${month}\-${day} ${hour}:${minute}:${seconds}`;
  }
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
    product.count++;
    this.totalCost = this.products.map(p => p.price * p.count).reduce((x, y) => x + y);
    sessionStorage.setItem("cartproducts", JSON.stringify(this.products));
  }

  onDecrease(product) {
    product.count--;
    if (product.count < 0) {
      product.count = 0;
    }
    this.totalCost = this.products.map(p => p.price * p.count).reduce((x, y) => x + y);
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
}
