import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-stock-dialog',
  templateUrl: './change-stock-dialog.component.html',
  styleUrls: ['./change-stock-dialog.component.css']
})
export class ChangeStockDialogComponent implements OnInit {

  min_stock: number = this.data.stockmin + 1;
  current_stock: number = this.data.amount;

  editStockForm: FormGroup = this._fb.group({
    id: [this.data.id,[Validators.required, Validators.min(0)]],
    amount: [,[Validators.required, Validators.min(this.min_stock)]],
  })

  constructor(private _dialogRef: MatDialogRef<ChangeStockDialogComponent>,
              private _matDialog: MatDialog,
              private _fb: FormBuilder,
              private _dataService: DataManagerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

  }

  validFieldEdit(field: string) {
    return this.editStockForm.controls[field].errors
      && this.editStockForm.controls[field].touched;
  }

  close() {
    this._dialogRef.close()
  }

  editStockWarning() {
    if(this.editStockForm.invalid) {
      return this.editStockForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea editar el stock de este producto?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.editStock()
        }
      })
    }
  }

  async editStock() {
    try {
      var res = await lastValueFrom(this._dataService.changeStockProduct(this.data.id, this.editStockForm.value.amount))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

}
