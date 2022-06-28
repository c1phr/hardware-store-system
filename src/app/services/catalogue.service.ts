import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  navig: Category[] = []

  category_name: string = '';
  subcat_name: string = '';
  product_name: string = '';

  private _checkExistance = new BehaviorSubject<boolean>(false);

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private http: HttpClient) {}

  setCategoryName(name: string) {
    this.category_name = name;
  }

  setSubcatName(cat_name: string, subcat_name: string) {
    this.category_name = cat_name;
    this.subcat_name = subcat_name;
  }
  setProductName(cat_name: string, subcat_name: string, prod_name: string) {
    this.category_name = cat_name;
    this.subcat_name = subcat_name;
    this.product_name = prod_name;
  }

  getCategoryLink(id: number): string {
    return this.navig.find(x => x.id === id)!.nav
  }

  getSubcatLink(id_cat: number, id_subcat: number): string {
    return this.navig.find(x => x.id === id_cat)!.subcat.find(x => x.id === id_subcat)!.nav;
  }

  getCategoryName(id: number): string {
    return this.navig.find(x => x.id === id)!.name
    //return this.category_name;
  }
  getSubcatName(id_cat: number, id_subcat: number): string {
    return this.navig.find(x => x.id === id_cat)!.subcat.find(x => x.id === id_subcat)!.name
    //return this.subcat_name;
  }
  getProductName(): string {
    return this.product_name;
  }

  checkExists(): Observable<boolean> {
    return this._checkExistance.asObservable();
  }

  async createNavig() {
    var resp_cat = await lastValueFrom(this.getCategories())
    var resp_sub = await lastValueFrom(this.getSubCategories())
    if(resp_cat && resp_sub) {
      await this.buildNavig(resp_cat.categorys, resp_sub.subcategorys)
      this._checkExistance.next(true);
      return this.navig;
    }
    else {
      return this.navig;
    }
  }

  getProducts(): Observable<any> {
    return this.http.get(this._baseUrl+'api/products')
  }

  getCategories(): Observable<any> {
    return this.http.get(this._baseUrl+'api/category')
  }

  getSubCategories(): Observable<any> {
    return this.http.get(this._baseUrl+'api/subcategory')
  }

  async buildNavig(categories: any[], subcategories: any[]) {
    var new_navig: Category[] = [];
    this.navig = new_navig;
    for(var i = 0; i < categories.length; i++) {
      if(!categories[i].removed) {
        var str = categories[i].name;
        str = str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
        str = str.replace(/\ /g,'-');
        str = str.replace(/\,/g,'');
        str = str.toLowerCase();
        var new_cat = {
          id: categories[i].id,
          name: categories[i].name,
          nav: `./catalogo/${categories[i].id}/${str}`,
          subcat: [],
          image_path: categories[i].url,
        };
        this.navig.push(new_cat)
      }
    }

    for(var i = 0; i < subcategories.length; i++) {
      if(!subcategories[i].removed) {
        var str = subcategories[i].name;
        str = str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
        str = str.replace(/\ /g,'-')
        str = str.replace(/\,/g,'');
        str = str.toLowerCase();
        var cat = this.navig.find(x => x.id == subcategories[i].id_category);
        var cat_index = this.navig.indexOf(cat!);
        var new_subcat = {
          id: subcategories[i].id,
          name: subcategories[i].name,
          nav: `./catalogo/${cat!.id}/${subcategories[i].id}/${str}`
        };
        this.navig[cat_index].subcat.push(new_subcat)
      }
    }
  }

  getCategoryProducts(cat_id?: string, subcat_id?: string): Observable<any> {
    var body = {
      id_category: cat_id,
      id_subcategory: subcat_id
    }
    return this.http.post(this._baseUrl + 'api/productcategory', body)
  }

  getProduct(id_product: string, cat_id: string, subcat_id: string): Observable<any> {
    var body = {
      id_product: id_product,
      id_category: cat_id,
      id_subcategory: subcat_id,
    };
    return this.http.post(this._baseUrl + 'api/selectproduct', body)
  }

  searchProduct(param: string): Observable<any> {
    var body = {
      name: param
    };
    return this.http.post(this._baseUrl + 'api/searchproduct', body)
  }

}
