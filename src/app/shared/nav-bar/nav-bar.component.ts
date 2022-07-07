import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Category } from 'src/app/interfaces/category.interface';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { LoginComponent } from '../../auth/pages/login/login.component';
import { UsersService } from '../../services/users.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { DataManagerService } from '../../services/data-manager.service';
import { ChangeStockDialogComponent } from '../../components/change-stock-dialog/change-stock-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CommsService } from '../../services/comms.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  innerWidth: number = document.defaultView!.innerWidth;

  navig: Category[] = []

  wh_navig: any[] = [
    {
      name: 'Dashboard General',
      nav: '../bodega/dashboard',
      icon: 'dashboard'
    },
    {
      name: 'Gestor de Productos',
      nav: '../bodega/mantenedor',
      icon: 'inventory_2'
    },
    {
      name: 'Gestor de Reportes',
      nav: '../bodega/reportes',
      icon: 'description'
    },
  ]

  sales_navig: any[] = [
    {
      name: 'Dashboard General',
      nav: '../ventas/dashboard',
      icon: 'dashboard'
    },
    {
      name: 'Gestor de Compra',
      nav: '../ventas/compra',
      icon: 'shopping_cart'
    },
    {
      name: 'Gestor de Reportes',
      nav: '../ventas/reportes',
      icon: 'description'
    },
    {
      name: 'Obtener Boleta',
      nav: '../ventas/boletas',
      icon: 'receipt'
    },
  ]

  admin_navig: any[] = [
    {
      name: 'Dashboard General',
      nav: '../admin/dashboard',
      icon: 'dashboard'
    },
    {
      name: 'Gestor de Usuarios',
      nav: '../admin/usuarios',
      icon: 'group'
    },
    {
      name: 'Gestor de Proveedores',
      nav: '../admin/proveedores',
      icon: 'inventory'
    },
    {
      name: 'Gestor de Categorías',
      nav: '../admin/categorias',
      icon: 'account_tree'
    },
    {
      name: 'Gestor de Stock',
      nav: '../admin/stock',
      icon: 'warehouse'
    },
    {
      name: 'Gestor de Reportes',
      nav: '../admin/reportes',
      icon: 'description'
    },
    {
      name: 'Gestor de Productos',
      nav: '../admin/productos',
      icon: 'settings_applications'
    },
    {
      name: 'Eliminar Registros',
      nav: '../admin/registros',
      icon: 'layers_clear'
    },
  ]

  wait_check: boolean = false;
  type: string = '';
  rut: string = '';
  wishlist: any[] = [];
  wishlist_msg: string = ''
  stock_min: any[] = []

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  dbProductChangeSub: Subscription | undefined = undefined;

  confirmedCart: boolean = false;

  input_regex: string = `[a-zA-ZÁÉÍÓÚÑáéíóúñü '-]+`
  filterValue: string = ''

  constructor(private _matDialog: MatDialog,
              private _router: Router,
              private _authService: AuthService,
              private _catalogueService: CatalogueService,
              private _userService: UsersService,
              private _dataService: DataManagerService,
              private _sb: MatSnackBar,
              private _commsServices: CommsService) {
                this.dbProductChangeSub = this._commsServices.dbProductChange$
                  .subscribe($event =>
                    this.receiveChange($event))
              }

  ngOnInit(): void { 
    this.type = this._authService.getType();
    if(this.checkLog() && !this.inStaff()) {
      this.rut = this._authService.getID()
      this.getWishlist(this.rut)
    }
    if(this.inAdmin() || this.inWH()) {
      this.getStockMinList()
    }

    if(this.inStart()) {
      this.getNavig()
    }
  }

  ngOnDestroy(): void {
    if(this.dbProductChangeSub) {
      this.dbProductChangeSub.unsubscribe()
    }
  }

  async getNavig() {
    this.navig = await this._catalogueService.createNavig()
    if(this.navig.length > 0) {
      this.wait_check = true;
    }
  }

  async getWishlist(rut: string) {
    try {
      var res = await lastValueFrom(this._userService.getWishlist(rut))
      if(res) {
        if(res.body && !res.body.msg) {
          this.confirmedCart = res.body[0].confirmcart
          this.sendConfirmChange(this.confirmedCart)
          this.wishlist = res.body;
          this.wishlistArray()
        }
        else {
          this.wishlist_msg = res.body.msg;
        }
      }
    }
    catch(error) {
      this.wishlist_msg = (error as HttpErrorResponse).error.msg;
    }
  }

  async getStockMinList() {
    this.stock_min = [];
    var res = await lastValueFrom(this._dataService.getStockMinList())
    if(res) {
      if(res.status == 200 && res.body && res.body.length > 0) {
        this.stock_min = res.body;
      }
    }
  }

  openLogin() {
    const popupRef = this._matDialog.open(LoginComponent, {
      autoFocus: false,
      maxWidth: 340,
      panelClass: ['login-dialog'],
      data: {
        open: true,
      }
    });
    popupRef.afterClosed().subscribe(res => {
      if(this.checkLog()) {
        this.rut = this._authService.getID()
        this.getWishlist(this.rut)
      }
    })
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/inicio'])
  }

  getPath():string {
    var path = this._router.url;
    if(path.includes('/inicio')) {
      return (path.replace('/inicio', '.'));
    }
    else{
      return path;
    }
  }

  getPathStaff():string {
    var path = this._router.url;
    if(path.includes('/staff')) {
      return (path.replace('/staff', '..'));
    }
    else{
      return path;
    }
  }

  checkLog(): boolean {
    return this._authService.isLoggedIn()
  }

  nameUser(): string {
    return this._authService.getName()
  }

  typeUser(): string {
    return this._authService.getType()
  }

  inWH(): boolean {
    return (this._router.url.includes('/bodega')) 
     ? true
     : false
  }

  inAdmin(): boolean {
    return (this._router.url.includes('/admin')) 
     ? true
     : false
  }

  inSales(): boolean {
    return (this._router.url.includes('/ventas')) 
     ? true
     : false
  }

  inStart(): boolean {
    return (this._router.url.includes('/inicio')) 
     ? true
     : false
  }

  inAuth(): boolean {
    return (this._router.url.includes('/auth')) 
     ? true
     : false
  }

  inStaff(): boolean {
    return (this._router.url.includes('/staff')) 
     ? true
     : false
  }

  search(event: any) {
    if(event) {
      this._router.navigate(['/inicio/productos'], {
        queryParams: { buscar: this.filterValue }
      });
    }
  }

  enterSystem() {
    this._router.navigate(['/staff/'+ this.type])
  }

  onResize(event: Event) {
    const window = event.target as Window
    this.innerWidth = window.innerWidth;
  }

  openWishlist() {
   this.getWishlist(this.rut)
  }

  wishlistArray() {
    for(var i=0; i<this.wishlist.length;i++) {
      //this.wishlist[i].url = `${this._baseUrl}${this.wishlist[i].url}`
      this.wishlist[i].nav = `/inicio/catalogo/${this.wishlist[i].category}/${this.wishlist[i].subcategory}/producto/${this.wishlist[i].id_product}`
    }
  }

  openDropdown(name: string) {
    var dropdown = document.getElementById(name)
    dropdown!.style.display = 'block'
  }

  closeDropdown(name: string) {
    var dropdown = document.getElementById(name)
    dropdown!.style.display = 'none'
  }

  openRestockDialog(id: number, amount: number, stockmin: number, name: string) {
    const dialogRestock = this._matDialog.open(ChangeStockDialogComponent, {
      autoFocus: false,
      maxWidth: 340,
      panelClass: ['register-product-dialog'],
      data: {
        id: id,
        amount: amount,
        stockmin: stockmin,
        name: name
      }
    });
    dialogRestock.afterClosed().subscribe(res => {
      if(res) {
        return (res.data.status === 200)
          ? (this.openSnackBar(res.data.message, this.configSuccess), this.reloadStock(), this.sendChange(res.data.message, 202))
          : (this.openSnackBar(res.data.message, this.configError))
      }
    })
  }

  reloadStock() {
    this.getStockMinList()
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

  receiveChange(event: any) {
    if(event.status === 201) {
      this.getStockMinList()
    }
  }

  sendChange(msg: string, status: number) {
    this._commsServices.createRestockChange({ msg: msg, status: status })
  }

  sendConfirmChange(status: boolean) {
    this._commsServices.createConfirmChange(status)
  }

}
