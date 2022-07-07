import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface LinkInfo{
  name: string,
  path: string,
}

export interface LinkGroup {
  name: string,
  path: string,
  links: LinkInfo[]
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footer_links: LinkGroup[] = [
    {
      name: 'Servicio al cliente',
      path: './',
      links: [
        {
          name: 'Términos y condiciones',
          path: './'
        },
        {
          name: 'Servicios de entrega',
          path: './'
        },
        {
          name: 'Políticas de privacidad',
          path: './'
        },
        {
          name: 'Garantía de precios',
          path: './'
        },
        {
          name: 'Medios de pago',
          path: './'
        },
        {
          name: 'Políticas de devolución y cambio',
          path: './'
        },
        {
          name: 'Contáctenos',
          path: './'
        },
      ]
    },
    {
      name: 'Mi cuenta',
      path: './',
      links: [
        {
          name: 'Regístrate',
          path: '/auth/registrar'
        },
        {
          name: 'Cambio de clave',
          path: '/inicio/perfil'
        },
        {
          name: 'Reestablecer clave',
          path: '/auth/reset-password'
        }
      ]
    },
    {
      name: 'Nuestra empresa',
      path: './',
      links: [
        {
          name: 'Quiénes somos',
          path: './'
        },
        {
          name: 'Misión y visión',
          path: './'
        },
        {
          name: 'Trabaja con nosotros',
          path: './'
        },
      ]
    }
  ]

  facebook_link: string = './'
  instagram_link: string = './'
  twitter_link: string = './'

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  inStaff(): boolean {
    return (this._router.url.includes('/staff')) 
     ? true
     : false
  }

}
