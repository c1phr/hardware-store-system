import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../auth/login/login.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  navig = [
    {
      name: 'construcción y ferretería',
      nav: './catalogo/construccion',
    },
    {
      name: 'pisos, pinturas y terminaciones',
      nav: './catalogo/terminaciones',
    },
    {
      name: 'herramientas y maquinaria',
      nav: './catalogo/herramientas',
    },
    {
      name: 'decoración e iluminación',
      nav: './catalogo/decoracion',
    },
    {
      name: 'baño, cocina y limpieza',
      nav: './catalogo/pipelines',
    }
  ]

  constructor(private _matDialog: MatDialog) { }

  ngOnInit(): void {

  }

  openLogin() {
    const popupRef = this._matDialog.open(LoginComponent, {
      autoFocus: false,
      maxWidth: 340,
      panelClass: ['login-dialog']
    });
    popupRef.afterClosed().subscribe(res => {
      console.log(`result: ${res}`)
    })
  }

}
