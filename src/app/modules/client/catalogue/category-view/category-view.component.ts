import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, NavigationEnd } from '@angular/router';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { Event } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Product } from '../../../../interfaces/product.interface';

import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';
registerLocaleData(localeEsCl, 'es-CL');

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;

  products_to_show: Product[] = [];

  id_category: string = '';
  name_category: string = '';
  category_link: string = '';

  category_products: Product[] = [];

  productsExist: boolean = false;

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService,
              private _router: Router) {
                this._activeRoute.paramMap.subscribe(params => {
                  this.changeNameAndIDs()
                  this.getCatProducts()
                });
              }

  ngOnInit(): void {
    this.products_to_show = this.category_products
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
    var resp = await this._catalogueService.getCategoryProducts(this.id_category, undefined).toPromise();
    this.category_products = [];
    if(resp && !resp.msg) {
      console.log(resp)
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
          desc: products[i].description,
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

  onPageChange(event: PageEvent) {
    this.products_to_show =  this.category_products.slice(event.pageIndex*event.pageSize, event.pageIndex*event.pageSize + event.pageSize);
    window.location.hash = '#top';
  }

}
