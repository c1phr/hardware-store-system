import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ReportService } from '../../../services/report.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warehouse-reports',
  templateUrl: './warehouse-reports.component.html',
  styleUrls: ['./warehouse-reports.component.css']
})
export class WarehouseReportsComponent implements OnInit {

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

  async getReportExist() {
    var res = await lastValueFrom(this._reportService.getReportExist())
    if(res) {
      var pdfUrl = URL.createObjectURL(res);
      this.openSnackBar('Reporte se obtuvo correctamente.', this.configSuccess)
      window.open(pdfUrl)
    }
    else {
      this.openSnackBar('No se pudo obtener el reporte de existencias.', this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
