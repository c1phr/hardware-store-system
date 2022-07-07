import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ProductManageDialogComponent } from './product-manage-dialog/product-manage-dialog.component';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  constructor(private _matDialog: MatDialog,
              private _sb: MatSnackBar,) { }

  ngOnInit(): void {
  }

  openProductDialog(type: string, subtype: string) {
    const popupRef = this._matDialog.open(ProductManageDialogComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      data: {
        type: type,
        subtype: subtype
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res) {
        return (res.data.status === 200)
          ? (this.openSnackBar(res.data.message, this.configSuccess))
          : (this.openSnackBar(res.data.message, this.configError))
      }
    })
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }


}
