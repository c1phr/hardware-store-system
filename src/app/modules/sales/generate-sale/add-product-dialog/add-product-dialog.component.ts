import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent implements OnInit {

  amount_to_add: number = 1

  constructor(private _dialogRef: MatDialogRef<AddProductDialogComponent>,
              private _matDialog: MatDialog,
              private _dataService: DataManagerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  close() {
    this._dialogRef.close()
  }

  validAmount() {
    return (this.amount_to_add < this.data.stock && this.amount_to_add >= 1)
      ? false
      : true
  }

  addProductWarning() {
    if(this.validAmount()) {
      return;
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea agregar el producto a la compra?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.addProduct()
        }
      })
    }
  }

  async addProduct() {
    try {
      var res = await lastValueFrom(this._dataService.addProductToSale(this.data.id_sale, this.data.id_product, this.amount_to_add))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse;
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

}
