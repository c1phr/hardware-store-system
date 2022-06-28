import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from 'src/app/shared/nav-bar/nav-bar.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { UsersManagerComponent } from './users-manager/users-manager.component';
import { SuppliersManagerComponent } from './suppliers-manager/suppliers-manager.component';
import { CategoriesManagerComponent } from './categories-manager/categories-manager.component';
import { StockManagerComponent } from './stock-manager/stock-manager.component';
import { ClearRegistryComponent } from './clear-registry/clear-registry.component';

const routes: Routes = [
  {
    path: '',
    component: NavBarComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'usuarios', component: UsersManagerComponent },
      { path: 'proveedores', component: SuppliersManagerComponent },
      { path: 'categorias', component: CategoriesManagerComponent },
      { path: 'stock', component: StockManagerComponent },
      { path: 'reportes', component: AdminReportsComponent },
      { path: 'productos', component: AdminProductsComponent },
      { path: 'registros', component: ClearRegistryComponent },
      { path: '**', redirectTo: 'dashboard'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
