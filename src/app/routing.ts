import { RouterModule } from '@angular/router';
import { ProductlistComponent } from './productlist/productlist.component';

export const routing = RouterModule.forRoot([
    { path: '', component: ProductlistComponent }
])
