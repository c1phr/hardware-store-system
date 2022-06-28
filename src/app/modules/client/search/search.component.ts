import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CatalogueService } from '../../../services/catalogue.service';
import { Product } from '../../../interfaces/product.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;

  results: Product[] = [];
  products_to_show: Product[] = [];

  searchQuery: string = ''

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService) {
                this._activeRoute.queryParams
                  .subscribe(params => {
                    this.searchQuery = params['buscar'];
                    this.searchProduct(this.searchQuery)
                  })
              }

  ngOnInit(): void {
  }

  
  async searchProduct(param: string) {
    this.results = [];
    var respSearch = await lastValueFrom(this._catalogueService.searchProduct(param))
    if(respSearch) {
      respSearch.products.forEach((element: any) => {
        element.url = this._baseUrl + element.url
        element.nav = `inicio/catalogo/${element.id_category}/${element.id_subcategory}/producto/${element.id}`
      });
      this.results = respSearch.products
      this.products_to_show = this.results;
      this.paginator._changePageSize(5);
    }
  }

  onPageChange(event: PageEvent, scroll: HTMLElement) {
    this.products_to_show =  this.results.slice(event.pageIndex*event.pageSize, event.pageIndex*event.pageSize + event.pageSize);
    //window.location.hash = '#top';
    scroll.scrollIntoView()
  }
}
