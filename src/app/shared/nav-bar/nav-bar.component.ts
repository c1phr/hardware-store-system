import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
      subcat: [
        {
          name: 'maderas y tablas',
          nav: './'
        },
        {
          name: 'ladrillos y bloques',
          nav: './'
        },
        {
          name: 'fierros, alambres y mallas',
          nav: './'
        },
        {
          name: 'cemento, morteros y aditivos',
          nav: './'
        },
        {
          name: 'tabiquería',
          nav: './'
        },
        {
          name: 'adhesivos',
          nav: './'
        },
        {
          name: 'aislación',
          nav: './'
        },
        {
          name: 'techumbre',
          nav: './'
        },
      ]
    },
    {
      name: 'pisos, pinturas y terminaciones',
      nav: './catalogo/terminaciones',
      subcat: [
        {
          name: 'pisos y revestimientos',
          nav: './'
        },
        {
          name: 'adhesivos, fragües y selladores',
          nav: './'
        },
        {
          name: 'marcos y molduras',
          nav: './'
        },
        {
          name: 'esmaltes y látex',
          nav: './'
        },
        {
          name: 'barnices y tratamiento',
          nav: './'
        },
        {
          name: 'pinturas especiales',
          nav: './'
        },
      ]
    },
    {
      name: 'herramientas y maquinaria',
      nav: './catalogo/herramientas',
      subcat: [
        {
          name: 'herramientas eléctricas',
          nav: './'
        },
        {
          name: 'maquinaria y herramientas estacionarias',
          nav: './'
        },
        {
          name: 'herramientas albañilería y construcción',
          nav: './'
        },
        {
          name: 'herramientas manuales',
          nav: './'
        },
        {
          name: 'maquinaria de jardín',
          nav: './'
        },
        {
          name: 'accesorios herramientas',
          nav: './'
        },
      ]
    },
    {
      name: 'decoración e iluminación',
      nav: './catalogo/decoracion',
      subcat: [
        {
          name: 'iluminación',
          nav: './'
        },
        {
          name: 'papel mural',
          nav: './'
        },
        {
          name: 'cortinas',
          nav: './'
        },
        {
          name: 'alfombras',
          nav: './'
        },
        {
          name: 'decoración hogar',
          nav: './'
        },
      ]
    },
    {
      name: 'baño, cocina y limpieza',
      nav: './catalogo/pipelines',
      subcat: [
        {
          name: 'sanitarios',
          nav: './'
        },
        {
          name: 'cabinas y duchas',
          nav: './'
        },
        {
          name: 'grifería y repuestos',
          nav: './'
        },
        {
          name: 'organización y limpieza',
          nav: './'
        },
      ]
    }
  ]

  constructor(private _matDialog: MatDialog,
              private _router: Router) { }

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

  getPath():string {
    var path = this._router.url;
    if(path.includes('/inicio')) {
      return (path.replace('/inicio', '.'));
    }
    else{
      return path;
    }
  }

}
