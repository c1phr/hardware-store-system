import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  private header = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private http: HttpClient) { }

  getUsers() {
    this.http.get<UsersCall>(this._baseUrl+'api/users', { headers: this.header })
      .subscribe(res => {
        console.log(res.users)
      })
  }

  getProducts() {
    this.http.get<any>(this._baseUrl+'api/products', { headers: this.header })
      .subscribe(res => {
        console.log(res)
      })
  }

  

}
