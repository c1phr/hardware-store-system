import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataManagerService } from '../../../services/data-manager.service';
import { lastValueFrom } from 'rxjs';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-receipt-manager',
  templateUrl: './receipt-manager.component.html',
  styleUrls: ['./receipt-manager.component.css']
})
export class ReceiptManagerComponent implements OnInit {

  receiptForm: FormGroup = this._fb.group({
    id_sale: [, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
  })

  check_receipt: boolean = false;
  
  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }
  constructor(private _fb: FormBuilder,
              private _dataService: DataManagerService,
              private _sb: MatSnackBar) { }

  ngOnInit(): void {
  }

  validField(field: string) {
    return this.receiptForm.controls[field].errors
      && this.receiptForm.controls[field].touched;
  }

  getReceipt() {
    if(this.receiptForm.invalid) {
      return this.receiptForm.markAllAsTouched();
    }
    else {
      this.sendReceiptRequest(this.receiptForm.value.id_sale)
    }
  }

  async sendReceiptRequest(id_sale: string) {
    try {
      var res = await lastValueFrom(this._dataService.getReceipt(id_sale))
      this.receiptForm.controls['id_sale'].setValue('');
      if(res && res.status === 200) {
        var receipt = URL.createObjectURL(res.body);
        this.openSnackBar('Boleta se obtuvo correctamente.', this.configSuccess)
        window.open(receipt)
      }
      else {
        this.openSnackBar('No se pudo obtener la boleta.', this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
