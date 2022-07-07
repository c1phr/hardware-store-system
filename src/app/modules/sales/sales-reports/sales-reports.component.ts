import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.css']
})
export class SalesReportsComponent implements OnInit {

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  constructor(private _reportService: ReportService,
              private _sb: MatSnackBar) { }

  ngOnInit(): void {
  }

  async getReportSalesPrice() {
    try {
      var res = await lastValueFrom(this._reportService.getReportSalesPrice())
      if(res) {
        var pdfUrl = URL.createObjectURL(res);
        this.openSnackBar('Reporte se obtuvo correctamente.', this.configSuccess)
        window.open(pdfUrl)
      }
      else {
        this.openSnackBar('No se pudo obtener el reporte de existencias.', this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  async getReportSalesAmount() {
    try {
      var res = await lastValueFrom(this._reportService.getReportSalesAmount())
      if(res) {
        var pdfUrl = URL.createObjectURL(res);
        this.openSnackBar('Reporte se obtuvo correctamente.', this.configSuccess)
        window.open(pdfUrl)
      }
      else {
        this.openSnackBar('No se pudo obtener el reporte de existencias.', this.configError)
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
