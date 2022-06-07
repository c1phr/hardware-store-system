import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private http: HttpClient) { }

  getReport() {
    this.http.get(this._baseUrl+'api/get-reporte-existencia', { responseType: 'blob' })
      .subscribe(res => {
        var pdfUrl = URL.createObjectURL(res);
        window.open(pdfUrl)
      })
  }

}
