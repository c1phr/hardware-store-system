import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _http: HttpClient) { }

  //PRODUCTS APIs

  changeProductStatus(id: number, removed: boolean): Observable<any> {
    var body = {
      id: id,
      removed: removed
    };
    return this._http.put(this._baseUrl + 'api/updatestatusproduct', body, { observe: 'response' })
  }

  modifyProducts(body: any): Observable<any> {
    return this._http.put(this._baseUrl + 'api/modifyproduct', body, { observe: 'response' })
  }

  addProduct(body: any): Observable<any> {
    return this._http.post(this._baseUrl + 'api/addproduct', body, { observe: 'response' })
  }

  getStockMinList(): Observable<any> {
    return this._http.get(this._baseUrl+'api/getproductstockmin', { observe: 'response' })
  }

  changeStockProduct(id: number, amount: number): Observable<any> {
    var body = {
      id: id,
      amount: amount
    }
    return this._http.put(this._baseUrl+'api/updatestock', body, { observe: 'response' })
  }

  uploadImageProduct(b64data: string, id_prod: number): Observable<any> {
    var body = {
      base64Data: b64data,
      id_product: id_prod
    }
    return this._http.post(this._baseUrl+'api/uploadimageproduct', body, { observe: 'response' })
  }

  //SALES APIs

  newSale(id_client: string, id_salesman: string): Observable<any> {
    var body = {
      id_cliente: id_client,
      id_salesman: id_salesman
    }
    return this._http.post(this._baseUrl+'api/addsale', body, { observe: 'response' })
  }

  newSaleWantedCart(rut: string, id_salesman: string): Observable<any> {
    var body = {
      rut: rut,
      id_salesman: id_salesman
    }
    return this._http.post(this._baseUrl+'api/addsalewantedcart', body, { observe: 'response' })
  }

  continueSale(id: string): Observable<any> {
    var body = {
      id: id
    };
    return this._http.post(this._baseUrl+'api/sales', body, { observe: 'response' })
  }

  addProductToSale(id_sale: number, id_product: number, amount: number): Observable<any> {
    var body = {
      id: id_sale,
      id_product: id_product,
      amount: amount
    }
    return this._http.post(this._baseUrl+'api/addproductsale', body, { observe: 'response' })
  }

  removeProductFromSale(id_sale: string, id_product: number): Observable<any> {
    var body = {
      id: id_sale,
      id_product: id_product
    }
    return this._http.post(this._baseUrl+'api/removeproductsale', body, { observe: 'response' })
  }

  confirmSale(id_sale: number, id_payment: number): Observable<any> {
    var body = {
      id: id_sale,
      id_payment_method: id_payment
    }
    return this._http.post(this._baseUrl+'api/confirmansale', body, { observe: 'response' })
  }

  confirmSaleWantedCart(id_sale: number, id_payment: number): Observable<any> {
    var body = {
      id: id_sale,
      id_payment_method: id_payment
    }
    return this._http.post(this._baseUrl+'api/confirmsalewantedcart', body, { observe: 'response' })
  }

  getReceipt(id_sale: string): Observable<any> {
    var body = {
      id: id_sale
    }
    return this._http.post(this._baseUrl+'api/get-boleta', body, { observe: 'response', responseType: 'blob' })
  }

  getPaymentMethods(): Observable<any> {
    return this._http.get(this._baseUrl+'api/getpaymentmethod', { observe: 'response' })
  }

  //users CRUD

  getUsers(): Observable<any> {
    return this._http.get(this._baseUrl+'api/users', { observe: 'response' })
  }

  toggleUserActivation(rut: string, banned: boolean): Observable<any> {
    var body = {
      rut: rut,
      banned: banned
    };
    return this._http.put(this._baseUrl+'api/updateuser', body, { observe: 'response' })
  }

  registerStaff(body: any): Observable<any> {
    return this._http.post(this._baseUrl+'registerstaff', body, { observe: 'response' })
  }

  registerUser(body: any): Observable<any> {
    return this._http.post(this._baseUrl+'register', body, { observe: 'response' })
  }

  modifyUser(body: any): Observable<any> {
    return this._http.post(this._baseUrl+'api/modifyuser', body, { observe: 'response' })
  }

  updatePassword(rut: string, pass: string, new_pass: string): Observable<any> {
    var body = {
      rut: rut,
      password: pass,
      newpassword: new_pass
    }
    return this._http.post(this._baseUrl+'resetpassword', body, { observe: 'response' })
  }

  resetPassword(email: string): Observable<any> {
    var body = {
      email: email
    }
    return this._http.post(this._baseUrl+'forgot-password', body, { observe: 'response' })
  }

  //suppliers CRUD
  getSuppliers(): Observable<any> {
    return this._http.get(this._baseUrl + 'api/suppliers')
  }

  createSupplier(body: any): Observable<any> {
    return this._http.post(this._baseUrl+'api/addsupplier', body, { observe: 'response' })
  }

  modifySupplier(body: any): Observable<any> {
    return this._http.post(this._baseUrl+'api/modifysupplier', body, { observe: 'response' })
  }

  toggleActiveSupplier(id: number, removed: boolean): Observable<any> {
    var body = {
      id: id,
      removed: removed
    }
    return this._http.post(this._baseUrl+'api/changestatussupplier', body, { observe: 'response' })
  }

  //categories CRUD
  createCategory(name: string, des: string): Observable<any> {
    var body = {
      name: name,
      description: des
    }
    return this._http.post(this._baseUrl+'api/createcategory', body, { observe: 'response' })
  }

  modifyCategory(id: number, name: string, des: string): Observable<any> {
    var body = {
      id: id,
      name: name,
      description: des
    }
    return this._http.post(this._baseUrl+'api/modifycategory', body, { observe: 'response' })
  }

  toggleActiveCategory(id: number, removed: boolean): Observable<any> {
    var body = {
      id: id,
      removed: removed
    }
    return this._http.post(this._baseUrl+'api/changestatuscategory', body, { observe: 'response' })
  }

  //TODO: currently is a get, needs to be a post
  uploadImageCategory(b64data: string, id_cat: number): Observable<any> {
    var body = {
      base64Data: b64data,
      id_category: id_cat
    }
    return this._http.post(this._baseUrl+'api/uploadimagecategory', body, { observe: 'response' })
  }

  //subcategories CRUD
  createSubcategory(name: string, des: string, id_cat: number): Observable<any> {
    var body = {
      name: name,
      description: des,
      id_category: id_cat
    }
    return this._http.post(this._baseUrl+'api/createsubcategory', body, { observe: 'response' })
  }

  modifySubcategory(id: number, name: string, des: string): Observable<any> {
    var body = {
      id: id,
      name: name,
      description: des
    }
    return this._http.post(this._baseUrl+'api/modifysubcategory', body, { observe: 'response' })
  }

  toggleActiveSubcategory(id: number, removed: boolean): Observable<any> {
    var body = {
      id: id,
      removed: removed
    }
    return this._http.post(this._baseUrl+'api/changestatussubcategory', body, { observe: 'response' })
  }
}
