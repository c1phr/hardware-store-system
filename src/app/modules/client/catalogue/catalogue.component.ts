import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ReportService } from '../../../services/report.service';
import { Category, Highlight } from '../../../interfaces/category.interface';
import { CatalogueService } from '../../../services/catalogue.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  categories: Category[] = []

  constructor(private _userService: UsersService,
              private _reportService: ReportService,
              private _catalogueService: CatalogueService) { }

  ngOnInit(): void {
    this.getCategories()
  }

  async getCategories() {
    var resp = await lastValueFrom(this._catalogueService.getCategories())
    if(resp) {
      this.createCat(resp.categorys);
    }
  }

  createCat(categories: any[]) {
    for(var i = 0; i < categories.length; i++) {
      if(!categories[i].removed) {
        var str = categories[i].name;
        str = str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
        str = str.replace(/\ /g,'-');
        str = str.replace(/\,/g,'');
        str = str.toLowerCase();
        var new_cat = {
          id: categories[i].id,
          name: categories[i].name,
          nav: `./${categories[i].id}/${str}`,
          subcat: [],
          image_path: `${this._baseUrl}${categories[i].url}`,
        };
        this.categories.push(new_cat)
        var index = this.categories.length - 1;
        this.getCategoryRandoms(this.categories[index].id, index)
      }
    }
  }

  async getCategoryRandoms(id: number, index: number) {
    var res = await lastValueFrom(this._catalogueService.getRandomProductsCategory(id))
    if(res) {
      this.productsArray(res.products, index)
    }
  }

  productsArray(array: Highlight[], index: number) {
    if(array){
      console.log(array)
      for(var i=0; i<array.length;i++) {
        array[i].nav = `/inicio/catalogo/${array[i].category}/${array[i].subcategory}/producto/${array[i].id}`
        array[i].url = `${this._baseUrl}${array[i].url}`
      }
    }
    this.categories[index].highlights = array;
  }

}
