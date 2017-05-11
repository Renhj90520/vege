import { RouterModule } from '@angular/router';
import { ProductlistComponent } from './productlist/productlist.component';
import { CartComponent } from './cart/cart.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';

export const routing = RouterModule.forRoot([
    { path: '', component: ProductlistComponent, data: { title: "商品列表" } },
    { path: 'orderlist', component: OrderlistComponent, data: { title: "我的订单" } },
    { path: 'cart', component: CartComponent, data: { title: "我的购物车" } },
    { path: 'productlist', component: ProductlistComponent, data: { title: "商品列表" } },
    { path: 'productlist/:id', component: ProductComponent, data: { title: "商品详情" } },
    { path: "order", component: OrderComponent, data: { title: "确认订单" } }
])
