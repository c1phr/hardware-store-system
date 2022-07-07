import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent implements OnInit {

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  wait_account: boolean = false;

  loginForm: FormGroup = this._fb.group({
    email: [,[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    password: [,[Validators.minLength(5), Validators.maxLength(16)]]
  })

  constructor(private _fb: FormBuilder,
              private _authService: AuthService,
              private _sb: MatSnackBar,
              private _router: Router,) { }

  ngOnInit(): void {
  }

  validField(field: string) {
    return this.loginForm.controls[field].errors
      && this.loginForm.controls[field].touched;
  }

  async login() {
    if(this.loginForm.invalid) {
      return this.loginForm.markAllAsTouched();
    }
    else {
      this.wait_account = true;
      const email = this.loginForm.value.email;
      const pass = this.loginForm.value.password;
      var res = await this._authService.staffLogin(email, pass)
      if(res) {
        this.wait_account = false
        return (res.status === 200)
            ? (this._router.navigate(['/staff/' + this._authService.getType()]), this.openSnackBar('Se inició sesión correctamente!', this.configSuccess))
            : (res.status === 400)
              ? (this.openSnackBar(res.msg, this.configError))
              : (this.openSnackBar(res.msg, this.configError))
      }
    }
  }


  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
