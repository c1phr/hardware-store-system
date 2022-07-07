import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';

@Component({
  selector: 'app-product-manage-dialog',
  templateUrl: './product-manage-dialog.component.html',
  styleUrls: ['./product-manage-dialog.component.css']
})
export class ProductManageDialogComponent implements OnInit {

  type: string = this.data.type;
  subtype: string = this.data.subtype;

  addProductForm: FormGroup = this._fb.group({
    id_sale: [, [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]],
    id_product: [,[Validators.required, Validators.min(0), Validators.max(10000000)]],
    description: [, [Validators.required, Validators.minLength(0), Validators.maxLength(1000), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü., \'\(\)\-]+$')]],
    amount: [, [Validators.required, Validators.min(1), Validators.max(10000)]]
  })

  removeProductForm: FormGroup = this._fb.group({
    id: [,[Validators.required, Validators.min(0), Validators.max(10000000)]],
  })

  constructor(private _dialogRef: MatDialogRef<ProductManageDialogComponent>,
              private _matDialog: MatDialog,
              private _fb: FormBuilder,
              private _dataService: DataManagerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  validFieldAdd(field: string) {
    return this.addProductForm.controls[field].errors
      && this.addProductForm.controls[field].touched;
  }

  validFieldRemove(field: string) {
    return this.removeProductForm.controls[field].errors
      && this.removeProductForm.controls[field].touched;
  }

  addDefectiveWarning() {
    if(this.addProductForm.invalid) {
      return this.addProductForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea registrar el producto defectuoso?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          var body = {
            id_sale: this.addProductForm.value.id_sale,
            id_product: this.addProductForm.value.id_product,
            description: this.addProductForm.value.description,
            amount: this.addProductForm.value.amount,
          }
          this.addDefective(body)
        }
      })
    }
  }

  addReturnWarning() {
    if(this.addProductForm.invalid) {
      return this.addProductForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea registrar la devolución?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          var body = {
            id_sale: this.addProductForm.value.id_sale,
            id_product: this.addProductForm.value.id_product,
            description: this.addProductForm.value.description,
            amount: this.addProductForm.value.amount,
          }
          this.addReturn(body)
        }
      })
    }
  }

  removeDefectiveWarning() {
    if(this.removeProductForm.invalid) {
      return this.removeProductForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea eliminar el producto defectuoso?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.removeDefective(this.removeProductForm.value.id)
        }
      })
    }
  }

  removeReturnWarning() {
    if(this.removeProductForm.invalid) {
      return this.removeProductForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea eliminar la devolución?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.removeReturn(this.removeProductForm.value.id)
        }
      })
    }
  }

  async addDefective(body: any) {
    try {
      var res = await lastValueFrom(this._dataService.addDefectiveProduct(body))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  async addReturn(body: any) {
    try {
      var res = await lastValueFrom(this._dataService.addReturnProduct(body))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  async removeDefective(id: number) {
    try {
      var res = await lastValueFrom(this._dataService.removeDefectiveProduct(id))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  async removeReturn(id: number) {
    try {
      var res = await lastValueFrom(this._dataService.removeReturnProduct(id))
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
