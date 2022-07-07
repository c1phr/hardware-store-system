import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './pages/register/register.component';
import { PassResetComponent } from './pages/pass-reset/pass-reset.component';

const routes: Routes = [
  {
    path: '',
    component: NavBarComponent,
    children: [
      { path: 'login', component: AuthComponent },
      { path: 'registrar', component: RegisterComponent },
      { path: 'reset-password', component: PassResetComponent },
      { path: '**', redirectTo: 'login' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
