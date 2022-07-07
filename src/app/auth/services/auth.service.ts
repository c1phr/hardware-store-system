import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, lastValueFrom } from 'rxjs';
import { Auth, Role } from '../interfaces/auth.interface';
import * as cryptoJS from 'crypto-js'
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: Auth = {
    rut: '',
    name: '',
    surname: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    role: -1,
  }

  private hashing: string = 'Lip37+NWEi57rSn='

  private _roles: Role[] = [
    {
      id: 1,
      role: 'client'
    },
    {
      id: 2,
      role: 'bodega'
    },
    {
      id: 3,
      role: 'ventas'
    },
    {
      id: 4,
      role: 'admin'
    }
  ]

  private header = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private http: HttpClient,
              private _cookieService: CookieService) { }

  async login(rut: string, pass: string): Promise<any> {
    const jsonString = {
      rut: rut,
      password: pass
    }
    try {
      var response = await lastValueFrom(this.http.post<any>(this._baseUrl+'login', jsonString, { observe: 'response' }))
      if(response) {
        if(response.status === 200) {
          this._user = response.body;
          var stringJSON = JSON.stringify(this._user);
          var user_info = cryptoJS.AES.encrypt(stringJSON, this.hashing);
          this._cookieService.set('userHWS', user_info.toString());
          const secret = this.getPhrase(this._user.role);
          const token = cryptoJS.AES.encrypt(this._user.email, secret);
          this._cookieService.set('tokenHWS', token.toString());
          return { status: 200, msg: 'Se inició sesión correctamente' }
        }
      }
    }
    catch(error) {
      var errorStat = error as HttpErrorResponse
      return { status: errorStat.status, msg: errorStat.error.msg }
    }
  }

  async staffLogin(email: string, pass: string): Promise<any> {
    const jsonString = {
      email: email,
      password: pass
    }
    try {
      var response = await lastValueFrom(this.http.post<any>(this._baseUrl+'loginstaff', jsonString, { observe: 'response' }))
      if(response) {
        if(response.status === 200) {
          this._user = response.body;
          var stringJSON = JSON.stringify(this._user);
          var user_info = cryptoJS.AES.encrypt(stringJSON, this.hashing);
          this._cookieService.set('userHWS', user_info.toString());
          const secret = this.getPhrase(this._user.role);
          const token = cryptoJS.AES.encrypt(this._user.email, secret);
          this._cookieService.set('tokenHWS', token.toString());
          return { status: 200, msg: 'Se inició sesión correctamente' }
        }
      }
    }
    catch(error) {
      var errorStat = error as HttpErrorResponse
      return { status: errorStat.status, msg: errorStat.error.msg }
    } 
  }

  searchEnc() {
    var stringJSON = this._cookieService.get('userHWS');
    if(stringJSON) {
      var decrypt = cryptoJS.AES.decrypt(stringJSON, this.hashing);
      this._user = JSON.parse(cryptoJS.enc.Utf8.stringify(decrypt));
    }
    
  }

  getPhrase(id: number) {
    for(var i=0; i<this._roles.length;i++) {
      if(this._roles[i].id == id) {
        return this._roles[i].role;
      }
    }
    return '';
  }

  logout(): void {
    this._cookieService.delete('tokenHWS');
    this._cookieService.delete('userHWS');
  }

  getType(): string {
    return this.getPhrase(this._user.role);
  }

  getID(): string {
    return this._user.rut;
  }

  isLoggedIn(): boolean {
    const token = this._cookieService.get('tokenHWS');
    if(token) {
      const decrypted = cryptoJS.AES.decrypt(token, this.getPhrase(this._user.role));
        return (cryptoJS.enc.Utf8.stringify(decrypted) as string == this._user.email as string) ? true : false;
    }
    else{
      return false;
    }
  }

  getName() {
    return this._user.name + ' '+ this._user.surname
  }

}
