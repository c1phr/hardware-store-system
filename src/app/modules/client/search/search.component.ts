import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CatalogueService } from '../../../services/catalogue.service';
import { Product } from '../../../interfaces/product.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

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

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _activeRoute: ActivatedRoute,
              private _authService: AuthService,
              private _userService: UsersService,
              private _catalogueService: CatalogueService,
              private _sb: MatSnackBar) {
                this._activeRoute.queryParams
                  .subscribe(params => {
                    this.searchQuery = params['buscar'];
                    this.searchProduct(this.searchQuery)
                  })
              }

  ngOnInit(): void {
  }

  
  async searchProduct(param: string) {
    this.results = [];;
    this.products_to_show = []
    var respSearch = await lastValueFrom(this._catalogueService.searchProduct(param))
    if(respSearch) {
      if(!respSearch.msg) {
        respSearch.forEach((element: any) => {
          element.nav = `inicio/catalogo/${element.id_category}/${element.id_subcategory}/producto/${element.id}`
        });
        this.results = respSearch
        this.products_to_show = this.results;
        this.paginator._changePageSize(5);
      }
    }
  }

  onPageChange(event: PageEvent, scroll: HTMLElement) {
    this.products_to_show =  this.results.slice(event.pageIndex*event.pageSize, event.pageIndex*event.pageSize + event.pageSize);
    scroll.scrollIntoView()
  }

  async addItemToWishlist(id: number) {
    var rut = this._authService.getID();
    try {
      var res = await lastValueFrom(this._userService.addProdToWishlist(rut, id, 1));
      if(res) {
        return (res.status === 200 && res.body.code != 1)
          ? this.openSnackBar(res.body.msg, this.configSuccess)
          : (res.status === 200 && res.body.code == 1)
            ? this.openSnackBar('Producto ya se encuentra en su carro de compra. Aumente la cantidad de items desde la wishlist.', this.configError)
            : this.openSnackBar(res.body.msg, this.configError)
      }
    }
    catch(error) {
      var errorStat = error as HttpErrorResponse;
      this.openSnackBar(errorStat.error.msg, this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }
}
