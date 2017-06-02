import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { routing } from './routing';
import { CartComponent } from './cart/cart.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { OrderStatePipe } from './shared/orderstate.pipe';
import { MyDatePipe } from './shared/mydate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductlistComponent,
    CartComponent,
    OrderlistComponent,
    OrderComponent,
    ProductComponent,
    OrderStatePipe,
    MyDatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
