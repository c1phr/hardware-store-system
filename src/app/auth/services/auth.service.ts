import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Auth, Role, User } from '../interfaces/auth.interface';
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
    role: 1,
  }

  private hashing: string = 'Lip37+NWEi57rSn='

  private _roles: Role[] = [
    {
      id: 1,
      role: 'client'
    },
    {
      id: 2,
      role: 'warehouse'
    },
    {
      id: 3,
      role: 'sales'
    },
    {
      id: 4,
      role: 'admin'
    }
  ]

  private _userInfo: User = {
    id: '1',
    name: 'Constanza',
    surname: 'Espinoza'
}

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
    var response = await this.http.post<any>(this._baseUrl+'login', jsonString).toPromise()
    if(response) {
      if(response.status === 200) {
        this._user.rut = response.rut;
        this._user.name = response.name;
        this._user.surname = response.surname;
        this._user.email = response.email;
        this._user.address = response.address;
        this._user.phone = response.phone;
        this._user.city = response.city;
        var stringJSON = JSON.stringify(this._user);
        var user_info = cryptoJS.AES.encrypt(stringJSON, this.hashing);
        this._cookieService.set('user', user_info.toString());
        const secret = this.getPhrase(this._user.role);
        const token = cryptoJS.AES.encrypt(this._user.email, secret);
        this._cookieService.set('token', token.toString());
        return { status: 200 }
      }
      else {
        return { status: response.status }
      }
    }
    else {
      return { status: 400 }
    }
    // if(rut != this._user.rut) {
    //   return of(new HttpResponse({ status: 400 }))
    // }
    // else {
    //   const hashedPass = cryptoJS.PBKDF2(pass, this._user.passwordSalt, {
    //     keySize: 16,
    //     iterations: 1000
    //   });
    //   if(this._user.passwordHash == hashedPass.toString()) {
    //     const secret = this.getPhrase(this._user.role);
    //     const token = cryptoJS.AES.encrypt(this._user.email, secret);
    //     this._cookieService.set('token', token.toString());
    //     return of(new HttpResponse({ status: 200 }))
    //   }
    //   else {
    //     return of(new HttpResponse({ status: 400 }))
    //   }
    // }
  }

  searchEnc() {
    var stringJSON = this._cookieService.get('user');
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
    this._cookieService.delete('token');
    this._cookieService.delete('user');
  }

  getType(): string {
    return this.getPhrase(this._user.role);
  }

  getID(): string {
    return this._user.rut;
  }

  isLoggedIn(): boolean {
    const token = this._cookieService.get('token');
    if(token) {
      const decrypted = cryptoJS.AES.decrypt(token, this.getPhrase(this._user.role));
        return (cryptoJS.enc.Utf8.stringify(decrypted) == this._user.email) ? true : false;
    }
    else{
      return false;
    }
  }

  getName() {
    return this._userInfo.name + ' '+ this._userInfo.surname
  }

}
