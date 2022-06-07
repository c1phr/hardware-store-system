import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../modules/material/material.module';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { RutPipe } from '../pipes/rut.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    RutPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NavBarComponent,
    FooterComponent,
    ComponentsModule,
    MaterialModule,
    RouterModule,
    RutPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    RutPipe
  ]
})
export class SharedModule { }
