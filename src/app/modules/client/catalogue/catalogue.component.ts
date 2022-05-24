import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  categories: any[] = [
    {
      name: 'construcción y ferretería',
      img_path: 'assets/categories/construction.jpg',
      link: './construccion',
      highlights: []
    },
    {
      name: 'pisos, pinturas y terminaciones',
      img_path: 'assets/categories/pisos.png',
      link: './terminaciones',
      highlights: []
    },
    {
      name: 'herramientas y maquinaria',
      img_path: 'assets/categories/herramientas.png',
      link: './herramientas',
      highlights: []
    },
    {
      name: 'decoración e iluminación',
      img_path: 'assets/categories/iluminacion.png',
      link: './decoracion',
      highlights: []
    },
    {
      name: 'baño, cocina y limpieza',
      img_path: 'assets/categories/bathroom.png',
      link: './pipelines',
      highlights: []
    }
  ]

  constructor(private _userService: UsersService) { }

  ngOnInit(): void {
  }

  getUsers() {
    this._userService.getUsers();
  }

}
