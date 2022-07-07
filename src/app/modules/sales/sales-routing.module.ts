import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from 'src/app/shared/nav-bar/nav-bar.component';
import { GenerateSaleComponent } from './generate-sale/generate-sale.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { SalesReportsComponent } from './sales-reports/sales-reports.component';
import { ReceiptManagerComponent } from './receipt-manager/receipt-manager.component';

const routes: Routes = [
  {
    path: '',
    component: NavBarComponent,
    children: [
      { path: 'dashboard', component: SalesDashboardComponent },
      { path: 'compra', component: GenerateSaleComponent },
      { path: 'reportes', component: SalesReportsComponent },
      { path: 'boletas', component: ReceiptManagerComponent },
      { path: '**', redirectTo: 'dashboard'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
