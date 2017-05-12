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
  products: Product[];
  newAddr: Address = new Address();
  ngOnInit() {
    this.addressService.getAllAddress()
      .subscribe(res => {
        this.addresses = res.body;
        if (this.addresses && this.addresses.length > 0) {
          this.addresses[0].ischecked = true;
        }
      });

    this.cartService.getAllInCart()
      .subscribe(res => {
        this.products = res.body;
      });
  }
  gotoOrders() {
    let address = this.addresses.filter(a => a.ischecked)[0];
    if (address) {
      address.products = this.products;
      this.orderService.addOrder(address)
        .subscribe(res => {
          this.router.navigate(['orderlist'], { replaceUrl: true });
        }, err => {
          if (err) {
            alert(err.message);
          }
        })
    } else {
      alert('请填选地址');
    }

  }

  onAddAddress() {
    this.addressService.addNewAddress(this.newAddr)
      .subscribe();
  }
}
