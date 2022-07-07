import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { GenerateSaleComponent } from './generate-sale/generate-sale.component';
import { ReceiptManagerComponent } from './receipt-manager/receipt-manager.component';
import { SalesReportsComponent } from './sales-reports/sales-reports.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProductDialogComponent } from './generate-sale/add-product-dialog/add-product-dialog.component';
import { ConfirmSaleDialogComponent } from './generate-sale/confirm-sale-dialog/confirm-sale-dialog.component';


@NgModule({
  declarations: [
    GenerateSaleComponent,
    ReceiptManagerComponent,
    SalesReportsComponent,
    SalesDashboardComponent,
    AddProductDialogComponent,
    ConfirmSaleDialogComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule
  ]
})
export class SalesModule { }
