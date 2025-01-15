import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { SalesComponent } from './pages/sales/sales.component';


export const routes: Routes = [
  { path: 'products', 
    component: ProductsComponent,
    data: {title: 'Produtos', subTitle: 'Adicionar um novo produto'}
  },
  {
    path: 'sales',
    component: SalesComponent,
    data: {title: 'Vendas'}
  }
];
