import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  reg_success: boolean = false;
  wait_spinner: boolean = false;

  pass_match: boolean = false;

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  newUserData: FormGroup = this._fb.group({
    rut: [,[Validators.required, Validators.minLength(8), Validators.maxLength(13), Validators.pattern("^([0-9]{7,8}-[0-9kK])$")]],
    name: [, [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü \'\-]+$')]],
    surname: [, [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü \'\-]+$')]],
    password: [, [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9&#@%!\$\^]{6,15}$')]],
    email: [,[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    address: [, [Validators.required, Validators.minLength(2), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
    phone: [,[Validators.required, Validators.min(0), Validators.pattern('^[0-9]{7,10}$')]],
    city: [,[Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
  })

  constructor(private _fb: FormBuilder,
              private _matDialog: MatDialog,
              private _dataService: DataManagerService,
              private _sb: MatSnackBar) { }

  ngOnInit(): void {
  }

  validField(field: string) {
    return this.newUserData.controls[field].errors
      && this.newUserData.controls[field].touched;
  }

  validPassword(pass: string): boolean {
    return (!this.newUserData.controls['password'].touched)
      ? (this.pass_match = false, false)
      : (this.newUserData.value.password === pass)
        ? (this.pass_match = true, false)
        : (this.pass_match = false, true)
  }


  registerWarning() {
    if(this.newUserData.invalid || !this.pass_match) {
      return this.newUserData.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea registrarse?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          var body = {
            rut: this.newUserData.value.rut,
            name: this.newUserData.value.name,
            surname: this.newUserData.value.surname,
            password: this.newUserData.value.password,
            email: this.newUserData.value.email,
            address: this.newUserData.value.address,
            phone: '+56'+this.newUserData.value.phone,
            city: this.newUserData.value.city,
          }
          this.registerUser(body)
        }
      })
    }
  }

  async registerUser(body: any) {
    this.wait_spinner = true;
    try {
      var res = await lastValueFrom(this._dataService.registerUser(body))
      if(res) {
        this.reg_success = true;
        this.wait_spinner = false;
      }
    }
    catch(error) {
      this.wait_spinner = false;
      var errorSt = error as HttpErrorResponse
      this.openSnackBar(errorSt.error.msg, this.configError);
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
