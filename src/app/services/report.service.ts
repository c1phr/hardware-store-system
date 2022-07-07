import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private http: HttpClient) { }

  getReportExist() {
    return this.http.get(this._baseUrl+'api/get-reporte-existencia', { responseType: 'blob' })
  }

  getReportDefects() {
    return this.http.get(this._baseUrl+'api/get-reporte-defective-product', { responseType: 'blob' })
  }

  getReportSalesPrice() {
    return this.http.get(this._baseUrl+'api/get-reporte-ventas-totales-por-precio', { responseType: 'blob' })
  }

  getReportSalesAmount() {
    return this.http.get(this._baseUrl+'api/get-reporte-ventas-totales-por-cantidad-vendida', { responseType: 'blob' })
  }

  getReportReturnedProducts() {
    return this.http.get(this._baseUrl+'api/get-reporte-productos-devueltos', { responseType: 'blob' })
  }

}
