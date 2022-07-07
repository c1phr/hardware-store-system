import { Component, Inject, OnInit } from '@angular/core';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-confirm-sale-dialog',
  templateUrl: './confirm-sale-dialog.component.html',
  styleUrls: ['./confirm-sale-dialog.component.css']
})
export class ConfirmSaleDialogComponent implements OnInit {

  selected_payment: number = -1;

  payment_list: any[] = []

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  constructor(private _dialogRef: MatDialogRef<ConfirmSaleDialogComponent>,
              private _matDialog: MatDialog,
              private _dataService: DataManagerService,
              private _sb: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.getPaymentList()
  }

  async getPaymentList() {
    try {
      var res = await lastValueFrom(this._dataService.getPaymentMethods())
      if(res) {
        if(res.status === 200){
          this.payment_list = res.body
        }
        else {
          return this.openSnackBar(res.body.msg, this.configError)
        }
      }
      else {
        return this.openSnackBar('Error al obtener los métodos de pago.', this.configError)
      }
    }
    catch(error) {
      return this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

  close() {
    this._dialogRef.close()
  }

  validPayment(): boolean {
    if(this.payment_list.filter(x => x.id === this.selected_payment).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  confirmationWarning() {
    if(this.validPayment()) {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea confirmar la compra por $${this.data.total}?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.confirmSale()
        }
      })
    }
    else {
      this.openSnackBar('Debe seleccionar un método de pago.', this.configError)
    }
  }

  async confirmSale() {
    try {
      var res = await lastValueFrom(this._dataService.confirmSale(this.data.id_sale, this.selected_payment))
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
