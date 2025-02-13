import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { SalesComponent } from './pages/sales/sales.component';
import { LoginComponent } from './pages/login/login.component';
import { StockComponent } from './pages/stock/stock.component';
import { AuthGuard } from './auth.guard';
import { AntiAuthGuard } from './anti-auth.guard';
import { StatisticsComponent } from './pages/statistics/statistics.component';

export const publicRoutes = ['/login'];

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [AntiAuthGuard]
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    data: { title: 'Estatísticas' }
  },
  { 
    path: 'products', 
    component: ProductsComponent,
    canActivate: [AuthGuard], 
    data: { title: 'Produtos', subTitle: 'Adicionar um novo produto' }
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [AuthGuard],
    data: { title: 'Vendas' }
  },
  {
    path: 'stock',
    component: StockComponent,
    canActivate: [AuthGuard],
    data: { title: 'Estoque' }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];