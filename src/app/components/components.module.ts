import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwiperModule } from 'swiper/angular';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { MaterialModule } from '../modules/material/material.module';
import { RouterModule } from '@angular/router';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';



@NgModule({
  declarations: [
    ProductSliderComponent,
    WarningDialogComponent
  ],
  imports: [
    CommonModule,
    SwiperModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    ProductSliderComponent
  ]
})
export class ComponentsModule { }
