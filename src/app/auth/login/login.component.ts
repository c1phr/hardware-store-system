import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RutPipe } from 'src/app/pipes/rut.pipe';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login_rut = '';

  loginForm: FormGroup = this._fb.group({
    rut: [,[Validators.required, Validators.minLength(11), Validators.maxLength(13), Validators.pattern("^([0-9]{1,3}(?:\.[0-9]{1,3}){2}-[0-9kK])$")]],
    password: [,[Validators.minLength(1), Validators.maxLength(16)]]
  })

  constructor(private _authService: AuthService,
              private _router: Router,
              private _fb: FormBuilder,
              private rutPipe: RutPipe,
              private _matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  validField(field: string) {
    return this.loginForm.controls[field].errors
      && this.loginForm.controls[field].touched;
  }

  async login() {
    this.loginForm.controls['rut'].setValue(this.rutPipe.transform(this.loginForm.controls['rut'].value));
    if(this.loginForm.invalid) {
      return this.loginForm.markAllAsTouched();
    }
    else {
      this.loginForm.controls['rut'].setValue(this.loginForm.controls['rut'].value.replace(/\./g,''));
      var res = await this._authService.login(this.loginForm.controls['rut'].value, this.loginForm.controls['password'].value)
      if(res) {
        return (res.status === 200 && (this._authService.getType() === 'client'))
          ? (this._router.navigate(['']), this._matDialog.closeAll())
          : (res.status === 200)
            ? (this._router.navigateByUrl('/'+this._authService.getType()), this._matDialog.closeAll())
            : console.log('ERROR')
      }
    }
  }

  register() {
    this._router.navigateByUrl('/auth/registrar');
  }

  validateRut() {
    var aux = this.rutPipe.transform(this.loginForm.controls['rut'].value);
    this.loginForm.controls['rut'].setValue(aux)
    return this.loginForm.controls['rut'].errors
      && this.loginForm.controls['rut'].touched;
  }

}
