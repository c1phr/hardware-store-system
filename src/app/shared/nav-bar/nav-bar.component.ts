import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Category } from 'src/app/interfaces/category.interface';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { LoginComponent } from '../../auth/pages/login/login.component';
import { UsersService } from '../../services/users.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

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
      name: 'Consultar Producto',
      nav: '../ventas/consulta',
      icon: 'help_center'
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

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _matDialog: MatDialog,
              private _router: Router,
              private _authService: AuthService,
              private _catalogueService: CatalogueService,
              private _userService: UsersService) {}

  ngOnInit(): void {
    this.getNavig()
    this.type = this._authService.getType();
    if(this.checkLog()) {
      this.rut = this._authService.getID()
      this.getWishlist(this.rut)
    }
  }

  async getNavig() {
    this.navig = await this._catalogueService.createNavig()
    if(this.navig.length > 0) {
      this.wait_check = true;
    }
  }

  async getWishlist(rut: string) {
    var res = await lastValueFrom(this._userService.getWishlist(rut))
    if(res) {
      if(res.body.want) {
        this.wishlist = res.body.want;
        this.wishlistArray()
      }
      else {
        this.wishlist_msg = res.body.msg;
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
      console.log(`result: ${res}`)
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

  search(event: Event) {
    var target = event.target as HTMLInputElement;
    this._router.navigate(['/inicio/productos'], {
      queryParams: { buscar: target.value }
    });
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
      this.wishlist[i].url = `${this._baseUrl}${this.wishlist[i].url}`
      this.wishlist[i].nav = `/inicio/catalogo/${this.wishlist[i].category}/${this.wishlist[i].subcategory}/producto/${this.wishlist[i].id_product}`
    }
  }

}
