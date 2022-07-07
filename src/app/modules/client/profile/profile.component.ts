import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  wait_spinner: boolean = false;
  pass_match: boolean = false;

  confirmed_wl: boolean = false;

  toggle_pass: boolean = false;
  disable_data: boolean = false;
  toggle_data_action: string = 'ACTIVAR'
  toggle_pass_action: string = 'ACTIVAR'

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  modifyUserData: FormGroup = this._fb.group({
    rut_profile: [,[Validators.required, Validators.minLength(8), Validators.maxLength(13), Validators.pattern("^([0-9]{7,8}-[0-9kK])$")]],
    name: [, [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü \'\-]+$')]],
    surname: [, [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü \'\-]+$')]],
    email: [,[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    address: [, [Validators.required, Validators.minLength(2), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
    phone: [,[Validators.required, Validators.min(0), Validators.pattern('^[0-9]{7,10}$')]],
    city: [,[Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
  })

  modifyPassData: FormGroup = this._fb.group({
    old_password: [, [Validators.required, Validators.minLength(1), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9&#@%!\$\^]{6,15}$')]],
    new_password: [, [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9&#@%!\$\^]{6,15}$')]],
  })

  constructor(private _fb: FormBuilder,
              private _matDialog: MatDialog,
              private _dataService: DataManagerService,
              private _authService: AuthService,
              private _sb: MatSnackBar,
              private _userService: UsersService) { }

  ngOnInit(): void {
    this.getUserData()
    //this.modifyUserData.disable()
  }

  async getUserData() {
    this.wait_spinner = true
    try {
      var res = await lastValueFrom(this._dataService.searchUser(this._authService.getID()))
      if(res) {
        this.confirmed_wl = res.body[0].confirmcart;
        this.wait_spinner = false;
        this.modifyUserData.controls['rut_profile'].setValue(res.body[0].rut)
        this.modifyUserData.controls['name'].setValue(res.body[0].name)
        this.modifyUserData.controls['surname'].setValue(res.body[0].surname)
        this.modifyUserData.controls['email'].setValue(res.body[0].email)
        this.modifyUserData.controls['address'].setValue(res.body[0].address)
        this.modifyUserData.controls['phone'].setValue(res.body[0].phone.replace('+56', ''))
        this.modifyUserData.controls['city'].setValue(res.body[0].city)
        this.toggleDisable()
      }
    }
    catch(error) {
      this.wait_spinner = false;
      var errorSt = error as HttpErrorResponse
      this.openSnackBar(errorSt.error.msg, this.configError);
    }
  }

  toggleDisable() {
    return (this.disable_data)
      ? (this.modifyUserData.enable(), this.toggle_data_action = 'DESACTIVAR', this.disable_data = false)
      : (this.modifyUserData.disable(), this.toggle_data_action = 'ACTIVAR', this.disable_data = true)
  }

  togglePassChange(scroll?: HTMLElement) {
    return (this.toggle_pass)
      ? (this.toggle_pass_action = 'ACTIVAR', this.toggle_pass = false)
      : (this.toggle_pass_action = 'DESACTIVAR', this.toggle_pass = true, scroll?.scrollIntoView())
  }

  validField(field: string) {
    return this.modifyUserData.controls[field].errors
      && this.modifyUserData.controls[field].touched;
  }

  validFieldPass(field: string) {
    return this.modifyPassData.controls[field].errors
      && this.modifyPassData.controls[field].touched;
  }

  validPassword(pass: string): boolean {
    return (!this.modifyPassData.controls['new_password'].touched)
      ? (this.pass_match = false, false)
      : (this.modifyPassData.value.new_password === pass)
        ? (this.pass_match = true, false)
        : (this.pass_match = false, true)
  }

  changeDataWarning() {
    if(this.modifyUserData.invalid) {
      return this.modifyUserData.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea cambiar sus datos de usuario?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          var body = {
            rut: this.modifyUserData.value.rut_profile,
            name: this.modifyUserData.value.name,
            surname: this.modifyUserData.value.surname,
            email: this.modifyUserData.value.email,
            address: this.modifyUserData.value.address,
            phone: this.modifyUserData.value.phone,
            city: this.modifyUserData.value.city,
          }
          this.changeData(body)
        }
      })
    }
  }

  changePassWarning() {
    if(this.modifyPassData.invalid) {
      return this.modifyPassData.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea cambiar contraseña?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.changePass(this.modifyUserData.value.rut_profile, this.modifyPassData.value.old_password, this.modifyPassData.value.new_password)
        }
      })
    }
  }

  async changeData(body: any) {
    this.wait_spinner = true;
    try {
      var res = await lastValueFrom(this._dataService.modifyUser(body))
      if(res) {
        this.wait_spinner = false;
        this.openSnackBar(res.body.msg, this.configSuccess)
        this.toggleDisable()
        this.getUserData()
      }
    }
    catch(error) {
      this.wait_spinner = false;
      var errorSt = error as HttpErrorResponse
      this.openSnackBar(errorSt.error.mg, this.configError)
    }
  }

  async changePass(rut: string, pass: string, new_pass: string) {
    this.wait_spinner = true;
    try {
      var res = await lastValueFrom(this._dataService.updatePassword(rut, pass, new_pass))
      if(res) {
        this.wait_spinner = false;
        this.openSnackBar(res.body.msg, this.configSuccess)
        this.getUserData();
        this.togglePassChange()
      }
    }
    catch(error) {
      this.wait_spinner = false;
      var errorSt = error as HttpErrorResponse
      this.openSnackBar(errorSt.error.mg, this.configError)
    }
  }

  deconfirmWarning() {
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea desbloquear la wishlist?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.deconfirmWishlist()
      }
    })
  }

  async deconfirmWishlist() {
    var res = await lastValueFrom(this._userService.changeStateWishlist(this._authService.getID(), false))
      if(res){
        this.openSnackBar('Se desbloqueo la wishlist. Puede hacer cambios nuevamente', this.configSuccess)
        this.getUserData()
      }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
