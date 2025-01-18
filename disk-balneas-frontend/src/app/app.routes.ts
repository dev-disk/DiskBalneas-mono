import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { SalesComponent } from './pages/sales/sales.component';
import { LoginComponent } from './pages/login/login.component';


export const routes: Routes = [
  { path: 'login', 
    component: LoginComponent,
  },
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
