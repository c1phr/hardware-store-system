import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RutPipe } from 'src/app/pipes/rut.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  login_rut = '';

  loginForm: FormGroup = this._fb.group({
    rut: [,[Validators.required, Validators.minLength(11), Validators.maxLength(13), Validators.pattern("^([0-9]{1,3}(?:\.[0-9]{1,3}){2}-[0-9kK])$")]],
    password: [,[Validators.minLength(1), Validators.maxLength(16)]]
  })

  wait_spinner: boolean = false;

  constructor(private _authService: AuthService,
              private _router: Router,
              private _fb: FormBuilder,
              private rutPipe: RutPipe,
              private _matDialog: MatDialog,
              private _sb: MatSnackBar,) { }

  ngOnInit(): void {
  }

  validField(field: string) {
    return this.loginForm.controls[field].errors
      && this.loginForm.controls[field].touched;
  }

  async login() {
    this.wait_spinner = true;
    this.loginForm.controls['rut'].setValue(this.rutPipe.transform(this.loginForm.controls['rut'].value));
    if(this.loginForm.invalid) {
      return this.loginForm.markAllAsTouched();
    }
    else {
      this.loginForm.controls['rut'].setValue(this.loginForm.controls['rut'].value.replace(/\./g,''));
      var res = await this._authService.login(this.loginForm.controls['rut'].value, this.loginForm.controls['password'].value)
      if(res) {
        this.wait_spinner = false;
        return (res.status === 200)
          ? (this._router.navigate(['']), this._matDialog.closeAll(), this.openSnackBar(res.msg, this.configSuccess))
          : (res.status === 400)
            ? (this.openSnackBar(res.msg, this.configError))
            : (this.openSnackBar(res.msg, this.configError))
      }
    }
  }

  closeDialogs() {
    this._matDialog.closeAll()
  }

  validateRut() {
    var aux = this.rutPipe.transform(this.loginForm.controls['rut'].value);
    this.loginForm.controls['rut'].setValue(aux)
    return this.loginForm.controls['rut'].errors
      && this.loginForm.controls['rut'].touched;
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
