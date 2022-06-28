import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from 'src/app/shared/nav-bar/nav-bar.component';
import { WarehouseDashboardComponent } from './warehouse-dashboard/warehouse-dashboard.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { WarehouseReportsComponent } from './warehouse-reports/warehouse-reports.component';

const routes: Routes = [
  {
    path: '',
    component: NavBarComponent,
    children: [
      { path: 'dashboard', component: WarehouseDashboardComponent },
      { path: 'mantenedor', component: ProductManagerComponent },
      { path: 'reportes', component: WarehouseReportsComponent },
      { path: '**', redirectTo: 'dashboard'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
