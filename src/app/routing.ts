import { RouterModule } from '@angular/router';
import { ProductlistComponent } from './productlist/productlist.component';
import { CartComponent } from './cart/cart.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { LoginComponent } from './login/login.component';
// import { FavoritelistComponent } from './favoritelist/favoritelist.component';
import { AuthGuard } from './shared/authguard';

export const routing = RouterModule.forRoot([
    { path: '', component: ProductlistComponent, canActivate: [AuthGuard], data: { title: '商品列表' } },
    { path: 'orderlist/#', component: OrderlistComponent, canActivate: [AuthGuard], data: { title: '我的订单' } },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard], data: { title: '我的购物车' } },
    { path: 'productlist', component: ProductlistComponent, canActivate: [AuthGuard], data: { title: '商品列表' } },
    { path: 'productlist/:id', component: ProductComponent, canActivate: [AuthGuard], data: { title: '商品详情' } },
    { path: 'order/#', component: OrderComponent, canActivate: [AuthGuard], data: { title: '确认订单' } },
    { path: 'login/:openid', component: LoginComponent },
    { path: 'login', component: LoginComponent }
]);

