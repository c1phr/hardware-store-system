import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Category } from 'src/app/interfaces/category.interface';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { LoginComponent } from '../../auth/login/login.component';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  navig: Category[] = []

  wait_check: boolean = false;


  constructor(private _matDialog: MatDialog,
              private _router: Router,
              private _authService: AuthService,
              private _catalogueService: CatalogueService) {}

  ngOnInit(): void {
    this.getNavig()
  }

  async getNavig() {
    this.navig = await this._catalogueService.createNavig()
    if(this.navig.length > 0) {
      this.wait_check = true;
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
}
