import { formatCurrency, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import SwiperCore, { Pagination, SwiperOptions } from 'swiper';

import localeEsCl from '@angular/common/locales/es-CL';
import { CatalogueService } from '../../services/catalogue.service';
import { lastValueFrom } from 'rxjs';
registerLocaleData(localeEsCl, 'es-CL');

SwiperCore.use([Pagination])

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit {
  slides: any[] = [];

  config: SwiperOptions = {
    centeredSlides: true,
    slidesPerView: 1,
    pagination: {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1
    },
    breakpoints: {
      1140: {
        slidesPerView: 3
      },
      700: {
        slidesPerView: 2
      }
    },
    grabCursor: true,
    freeMode: true,
    rewind: true,
    autoHeight: true,
    spaceBetween: 10,
    initialSlide: 1,
    slideToClickedSlide: true,
    loop: true,
    threshold: 20
  }

  check_prod: boolean = false;

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _catalogueService: CatalogueService) { }


  ngOnInit(): void {
    this.getProducts()
  }

  async getProducts() {
    this.check_prod = false;
    var res = await lastValueFrom(this._catalogueService.getRandomProducts())
    if(res) {
      this.slides = res.products
      this.productsArray()
    }
  }

  productsArray() {
    for(var i=0; i<this.slides.length;i++) {
      this.slides[i].nav = `/inicio/catalogo/${this.slides[i].category}/${this.slides[i].subcategory}/producto/${this.slides[i].id}`
      this.slides[i].url = `${this._baseUrl}${this.slides[i].url}`
      this.check_prod = true;
    }
    this.check_prod = true;
    console.log(this.slides)
  }

}
