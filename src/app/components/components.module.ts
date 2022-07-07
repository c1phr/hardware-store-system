import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwiperModule } from 'swiper/angular';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { MaterialModule } from '../modules/material/material.module';
import { RouterModule } from '@angular/router';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { ChangeStockDialogComponent } from './change-stock-dialog/change-stock-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductSliderComponent,
    WarningDialogComponent,
    ChangeStockDialogComponent
  ],
  imports: [
    CommonModule,
    SwiperModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ProductSliderComponent
  ]
})
export class ComponentsModule { }
