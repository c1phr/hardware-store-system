import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, NavigationEnd } from '@angular/router';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { Event } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Product } from '../../../../interfaces/product.interface';

import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
registerLocaleData(localeEsCl, 'es-CL');

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;


  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  products_to_show: Product[] = [];

  id_category: string = '';
  name_category: string = '';
  category_link: string = '';

  category_products: Product[] = [];

  productsExist: boolean = false;

  checkLogged: boolean = false;

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService,
              private _authService: AuthService,
              private _userService: UsersService,
              private _sb: MatSnackBar,
              private _router: Router) {
                this._activeRoute.paramMap.subscribe(params => {
                  this.changeNameAndIDs()
                  this.getCatProducts()
                });
              }

  ngOnInit(): void {
    this.products_to_show = this.category_products
    this.checkLogged = this._authService.isLoggedIn()
  }

  changeNameAndIDs() {
    this.id_category = this._activeRoute.snapshot.paramMap.get('id_cat')!
    this._catalogueService.checkExists()
      .subscribe((res: boolean) => {
        if(res) {
          this.name_category = this._catalogueService.getCategoryName(Number(this.id_category))
          this.category_link = "inicio/"+this._catalogueService.getCategoryLink(Number(this.id_category))
          
        }
      })
  }

  async getCatProducts() {
    var resp = await lastValueFrom(this._catalogueService.getCategoryProducts(this.id_category, undefined))
    this.category_products = [];
    if(resp && !resp.msg) {
      this.productsExist = true;
      this.productsArray(resp.products);
      this.paginator._changePageSize(10);
    }
    else {
      this.productsExist = false;
    }
  }

  productsArray(products: any[]) {
    for(var i=0; i<products.length;i++) {
      if(!products[i].removed) {
        var newProd: Product = {
          amount: products[i].amount,
          brand: products[i].brand,
          description: products[i].description,
          id: products[i].id,
          name: products[i].name,
          url: `${this._baseUrl}${products[i].url}`,
          value: products[i].value,
          nav: `inicio/catalogo/${this.id_category}/${products[i].id_subcategory}/producto/${products[i].id}`
        };
        this.category_products.push(newProd);
      }
    }
    this.products_to_show = this.category_products;
  }

  onPageChange(event: PageEvent, scroll: HTMLElement) {
    this.products_to_show =  this.category_products.slice(event.pageIndex*event.pageSize, event.pageIndex*event.pageSize + event.pageSize);
    //window.location.hash = '#top';
    scroll.scrollIntoView()
  }

  async addItemToWishlist(id: number) {
    var rut = this._authService.getID();
    var res = await lastValueFrom(this._userService.addProdToWishlist(rut, id, 1));
    if(res) {
      return (res.status === 200)
        ? this.openSnackBar(res.body.msg, this.configSuccess)
        : this.openSnackBar(res.body.msg, this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
