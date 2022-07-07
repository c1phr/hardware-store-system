import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from '../../../../services/data-manager.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  selected_role: string = '2';

  newUserData: FormGroup = this._fb.group({
    rut: [,[Validators.required, Validators.minLength(8), Validators.maxLength(13), Validators.pattern("^([0-9]{7,8}-[0-9kK])$")]],
    name: [, [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü \'\-]+$')]],
    surname: [, [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü \'\-]+$')]],
    email: [,[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    address: [, [Validators.required, Validators.minLength(2), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
    phone: [,[Validators.required, Validators.min(0), Validators.pattern('^[0-9]{7,10}$')]],
    city: [,[Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
  })

  constructor(private _fb: FormBuilder,
              private _dialogRef: MatDialogRef<RegisterUserComponent>,
              private _matDialog: MatDialog,
              private _dataService: DataManagerService) { }

  ngOnInit(): void {
  }

  validField(field: string) {
    return this.newUserData.controls[field].errors
      && this.newUserData.controls[field].touched;
  }

  getRoleName(id: number): string {
    return (id === 2)
      ? 'Bodega'
      : (id === 3)
        ? 'Ventas'
        : 'Desconocido'
  }

  addUserWarning() {
    if(this.newUserData.invalid) {
      return this.newUserData.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea agregar el usuario al sistema?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          var body = {
            rut: this.newUserData.value.rut,
            name: this.newUserData.value.name,
            surname: this.newUserData.value.surname,
            email: this.newUserData.value.email,
            address: this.newUserData.value.address,
            phone: '+56'+this.newUserData.value.phone,
            city: this.newUserData.value.city,
            Role: Number(this.selected_role)
          }
          this.addUser(body)
        }
      })
    }
  }

  async addUser(body: any) {
    try {
      var res = await lastValueFrom(this._dataService.registerStaff(body))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  close() {
    this._dialogRef.close()
  }


}
