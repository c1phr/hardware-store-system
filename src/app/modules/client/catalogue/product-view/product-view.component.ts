import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/product.interface';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CommsService } from 'src/app/services/comms.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  selectedProduct: Product  = {
    amount: 0,
    brand: '',
    description: '',
    id: -1,
    name: '',
    url: '',
    value: 0,
    nav: ''
  };

  id_category: string = '';
  id_subcat: string = '';
  id_product: string = '';

  name_category: string = '';
  name_subcat: string = '';
  name_product: string = '';
  category_link: string = '';
  subcat_link: string = '';

  productExist: boolean = false;
  productChecked: boolean = false;
  checkLogged: boolean = false;

  amount: number = 1;

  confirmedcart: boolean = false;

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService,
              private _authService: AuthService,
              private _userService: UsersService,
              private _commsService: CommsService,
              private _sb: MatSnackBar,) {
                this._activeRoute.paramMap.subscribe(params => {
                  this.productChecked = false;
                  this.changeNameAndIDs()
                  this.getProduct()
                });
                this._commsService.confirmStatusChange$.subscribe(status => this.confirmedcart = status);
              }

  ngOnInit(): void {
    this.checkLogged = this._authService.isLoggedIn()
    this._commsService.confirmStatusChange$.subscribe(status => this.confirmedcart = status);
  }

  changeNameAndIDs() {
    this.id_category = this._activeRoute.snapshot.paramMap.get('id_cat')!
    this.id_subcat = this._activeRoute.snapshot.paramMap.get('id_sub')!
    this.id_product = this._activeRoute.snapshot.paramMap.get('id_product')!
    this._catalogueService.checkExists()
      .subscribe((res: boolean) => {
        if(res) {
          this.name_category = this._catalogueService.getCategoryName(Number(this.id_category))
          this.name_subcat = this._catalogueService.getSubcatName(Number(this.id_category), Number(this.id_subcat))
          this.category_link = "inicio/"+this._catalogueService.getCategoryLink(Number(this.id_category))
          this.subcat_link = "inicio/"+this._catalogueService.getSubcatLink(Number(this.id_category), Number(this.id_subcat))
        }
      })
  }

  async getProduct() {
    var resp = await lastValueFrom(this._catalogueService.getProduct(this.id_product, this.id_category, this.id_subcat))
    if(resp && !resp.msg) {
      this.productExist = true;
      this.selectedProduct = resp[0];
      this.name_product = resp[0].name;
      this.selectedProduct!.url = resp[0].url;
      this.selectedProduct!.description = resp[0].description;
      this.productChecked = true;
    }
    else {
      this.productExist = false;
      this.productChecked = true;
    }
  }

  async addItemToWishlist(id: number) {
    var rut = this._authService.getID();
    try {
      var res = await lastValueFrom(this._userService.addProdToWishlist(rut, id, this.amount));
      if(res) {
        return (res.status === 200 && res.body.code != 1)
          ? this.openSnackBar(res.body.msg, this.configSuccess)
          : (res.status === 200 && res.body.code == 1)
            ? this.openSnackBar('Producto ya se encuentra en su carro de compra. Aumente la cantidad de items desde la wishlist.', this.configError)
            : this.openSnackBar(res.body.msg, this.configError)
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this.openSnackBar(errorSt.error.msg, this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }
  
}
