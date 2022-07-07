import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-supplier',
  templateUrl: './register-supplier.component.html',
  styleUrls: ['./register-supplier.component.css']
})
export class RegisterSupplierComponent implements OnInit {

  type: string = this.data.type;

  supplierForm: FormGroup = this._fb.group({
    name: [,[Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü. \'\(\)\-]+$')]],
    description: [, [Validators.required, Validators.minLength(2), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
    email: [,[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    address: [, [Validators.required, Validators.minLength(2), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
    phone: [,[Validators.required, Validators.min(0), Validators.pattern('^[0-9]{7,10}$')]],
  })

  constructor(private _dialogRef: MatDialogRef<RegisterSupplierComponent>,
              private _matDialog: MatDialog,
              private _fb: FormBuilder,
              private _dataService: DataManagerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.sup) {	
      var phone = this.data.sup.phone.replace('+56', '').replace(/\ /g, '').replace(/\(/g, '').replace(/\)/g, '')
      this.supplierForm.controls['name'].setValue(this.data.sup.name);
      this.supplierForm.controls['email'].setValue(this.data.sup.email);
      this.supplierForm.controls['address'].setValue(this.data.sup.address);
      this.supplierForm.controls['description'].setValue(this.data.sup.description);
      this.supplierForm.controls['phone'].setValue(phone);
    }
  }

  validField(field: string) {
    return this.supplierForm.controls[field].errors
      && this.supplierForm.controls[field].touched;
  }

  addSupplierWarning() {
    if(this.supplierForm.invalid) {
      return this.supplierForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea agregar el proveedor al sistema?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          var body = {
            name: this.supplierForm.value.name,
            description: this.supplierForm.value.description,
            email: this.supplierForm.value.email,
            address: this.supplierForm.value.address,
            phone: '+56'+this.supplierForm.value.phone,
          }
          this.addSupplier(body)
        }
      })
    }
  }

  editSupplierWarning() {
    if(this.supplierForm.invalid) {
      return this.supplierForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea editar el proveedor?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          var body = {
            name: this.supplierForm.value.name,
            description: this.supplierForm.value.description,
            email: this.supplierForm.value.email,
            address: this.supplierForm.value.address,
            phone: '+56'+this.supplierForm.value.phone,
          }
          this.editSupplier(body)
        }
      })
    }
  }

  async addSupplier(body: any) {
    try {
      var res = await lastValueFrom(this._dataService.createSupplier(body))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  async editSupplier(body: any) {
    try {
      var res = await lastValueFrom(this._dataService.modifySupplier(body))
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
