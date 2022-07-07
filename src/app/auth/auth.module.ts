import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../modules/material/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { StaffLoginComponent } from './pages/staff-login/staff-login.component';
import { PassResetComponent } from './pages/pass-reset/pass-reset.component';



@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    StaffLoginComponent,
    PassResetComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class AuthModule { }
