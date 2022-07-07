import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { lastValueFrom } from 'rxjs';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { DataManagerService } from '../../../services/data-manager.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-clear-registry',
  templateUrl: './clear-registry.component.html',
  styleUrls: ['./clear-registry.component.css']
})
export class ClearRegistryComponent implements OnInit {

  wait_spinner: boolean = false;
  success_check: boolean = false;

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }


  constructor(private _matDialog: MatDialog,
              private _sb: MatSnackBar,
              private _dataService: DataManagerService) { }

  ngOnInit(): void {
  }

  clearRegistryWarning() {
    this.wait_spinner = true;
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea eliminar los registros de ventar que tengan más de dos años de antigüedad?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.clearRegistry()
      }
      else {
        this.wait_spinner = false;
      }
    })
  }

  async clearRegistry() {
    try {
      var res = await lastValueFrom(this._dataService.clearRegistry())
      if(res) {
        this.wait_spinner = false;
        this.success_check = true;
        this.openSnackBar(res.body.msg, this.configSuccess)
      }
    }
    catch(error) {
      this.wait_spinner = false;
      var errorSt = error as HttpErrorResponse
      this.openSnackBar(errorSt.error.msg, this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }


}
