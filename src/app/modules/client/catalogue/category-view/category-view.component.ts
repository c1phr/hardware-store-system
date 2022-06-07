import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, NavigationEnd } from '@angular/router';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { Event } from '@angular/router';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  id_category: string = '';
  name_category: string = '';

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService,
              private _router: Router) {
                this._activeRoute.paramMap.subscribe(params => {
                  this.changeNameAndIDs()
                });
              }

  ngOnInit(): void {
  }

  changeNameAndIDs() {
    this.id_category = this._activeRoute.snapshot.paramMap.get('id_cat')!
    this._catalogueService.checkExists()
      .subscribe((res: boolean) => {
        if(res) {
          this.name_category = this._catalogueService.getCategoryName(Number(this.id_category))
        }
      })
  }

}
