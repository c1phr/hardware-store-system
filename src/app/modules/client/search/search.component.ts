import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CatalogueService } from '../../../services/catalogue.service';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  results: Product[] = [];

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

  //TODO: get id_category from product search
  async searchProduct(param: string) {
    this.results = [];
    var respSearch = await lastValueFrom(this._catalogueService.searchProduct(param))
    if(respSearch) {
      respSearch.products.forEach((element: any) => {
        element.url = this._baseUrl + element.url
        element.nav = `inicio/catalogo/6/${element.id_subcategory}/producto/${element.id}`
      });
      this.results = respSearch.products
    }
  }

}
