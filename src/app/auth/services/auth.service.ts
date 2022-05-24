import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private header = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  private _baseUrl: string = 'https://shrouded-taiga-53918.herokuapp.com/'

  constructor(private http: HttpClient) { }

  login(rut: string, pass: string) {
    const jsonString = {
      rut: rut,
      password: pass
    }
    return this.http.post<any>(this._baseUrl+'login', jsonString)
      .subscribe( res => {
        console.log(res)
      })
  }

}
