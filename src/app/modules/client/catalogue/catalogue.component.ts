import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ReportService } from '../../../services/report.service';
import { Category } from '../../../interfaces/category.interface';
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
      }
    }
  }

}
