import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.css']
})
export class PassResetComponent implements OnInit {

  reset_success: boolean = false;
  wait_spinner: boolean = false;

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  passResetForm: FormGroup = this._fb.group({
    email: [,[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
  })

  constructor(private _fb: FormBuilder,
              private _matDialog: MatDialog,
              private _dataService: DataManagerService,
              private _sb: MatSnackBar) { }

  ngOnInit(): void {
  }

  validField(field: string) {
    return this.passResetForm.controls[field].errors
      && this.passResetForm.controls[field].touched;
  }

  resetWarning() {
    if(this.passResetForm.invalid) {
      return this.passResetForm.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea reestablecer contraseña?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.resetPass(this.passResetForm.value.email)
        }
      })
    }
  }

  async resetPass(email: string) {
    this.wait_spinner = true;
    try {
      var res = await lastValueFrom(this._dataService.resetPassword(email))
      if(res) {
        this.reset_success = true;
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
