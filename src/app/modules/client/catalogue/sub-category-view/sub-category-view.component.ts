import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogueService } from 'src/app/services/catalogue.service';

@Component({
  selector: 'app-sub-category-view',
  templateUrl: './sub-category-view.component.html',
  styleUrls: ['./sub-category-view.component.css']
})
export class SubCategoryViewComponent implements OnInit {

  id_category: string = '';
  id_subcat: string = '';
  name_category: string = '';
  name_subcat: string = '';

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService,) {
                this._activeRoute.paramMap.subscribe(params => {
                  this.changeNameAndIDs()
                });
              }

  ngOnInit(): void {
  }

  changeNameAndIDs() {
    this.id_category = this._activeRoute.snapshot.paramMap.get('id_cat')!
    this.id_subcat = this._activeRoute.snapshot.paramMap.get('id_sub')!
    this._catalogueService.checkExists()
      .subscribe((res: boolean) => {
        if(res) {
          this.name_category = this._catalogueService.getCategoryName(Number(this.id_category))
          this.name_subcat = this._catalogueService.getSubcatName(Number(this.id_category), Number(this.id_subcat))
        }
      })
  }

}
