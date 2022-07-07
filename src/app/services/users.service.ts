import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

export interface User {
  rut: string;
  surname: string,
  phone: string,
  password: string,
  name: string,
  email: string,
  city: string,
  banned: boolean,
  address: string
}

export interface UsersCall {
  users: User[]
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  wishlist: any[] = [];
  wishlist_msg: string = ''

  private header = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/api'

  constructor(private _http: HttpClient) { }

  getWishlist(rut: string): Observable<any> {
    var body = {
      rut: rut
    }
    return this._http.post(this._baseUrl + '/getwantedcart', body, { headers: this.header, observe: 'response' })
  }

  addProdToWishlist(rut: string, id: number, amount: number): Observable<any> {
    var body = {
      rut: rut,
      id_product: id,
      amount: amount
    }
    return this._http.post(this._baseUrl + '/addproductwantedcart', body, { observe: 'response' })
  }

  editProdWishlist(rut: string, id: number, amount: number): Observable<any> {
    var body = {
      rut: rut,
      id_product: id,
      amount: amount
    }
    return this._http.post(this._baseUrl + '/modifyproductwantedcart', body, { observe: 'response' })
  }

  removeProdWishlist(rut: string, id: number): Observable<any> {
    var body = {
      rut: rut,
      id_product: id,
    }
    return this._http.post(this._baseUrl + '/deleteproductwantedcart', body, { observe: 'response' })
  }

  changeStateWishlist(rut: string, confirmcart: boolean) {
    var body = {
      rut: rut,
      confirmcart: confirmcart
    }
    return this._http.post(this._baseUrl+'/modifystatewantedcart', body, { observe: 'response' })
  }

}
