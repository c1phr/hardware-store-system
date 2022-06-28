import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _http: HttpClient) { }

  changeProductStatus(id: number, removed: boolean): Observable<any> {
    var body = {
      id: id,
      removed: removed
    };
    return this._http.put(this._baseUrl + 'api/updatestatusproduct', body, { observe: 'response' })
  }

  deleteProduct(id: number): Observable<any> {
    var body = {
      id: id,
    };
    return this._http.post(this._baseUrl + 'api/deleteproduct', body, { observe: 'response' })
  }

  getSuppliers(): Observable<any> {
    return this._http.get(this._baseUrl + 'api/suppliers')
  }

  modifyProducts(body: any): Observable<any> {
    return this._http.put(this._baseUrl + 'api/modifyproduct', body, { observe: 'response' })
  }

  addProduct(body: any): Observable<any> {
    return this._http.post(this._baseUrl + 'api/addproduct', body, { observe: 'response' })
  }
  
}
