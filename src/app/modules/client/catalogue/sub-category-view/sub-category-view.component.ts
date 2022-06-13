import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/product.interface';
import { CatalogueService } from 'src/app/services/catalogue.service';

@Component({
  selector: 'app-sub-category-view',
  templateUrl: './sub-category-view.component.html',
  styleUrls: ['./sub-category-view.component.css']
})
export class SubCategoryViewComponent implements OnInit {

  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;

  products_to_show: Product[] = [];

  id_category: string = '';
  id_subcat: string = '';
  name_category: string = '';
  name_subcat: string = '';
  category_link: string = '';
  subcat_link: string = '';

  subcategory_products: Product[] = [];

  productsExist: boolean = false;

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService,) {
                this._activeRoute.paramMap.subscribe(params => {
                  this.changeNameAndIDs()
                  this.getSubcatProducts()
                });
              }

  ngOnInit(): void {
    this.products_to_show = this.subcategory_products
  }

  changeNameAndIDs() {
    this.id_category = this._activeRoute.snapshot.paramMap.get('id_cat')!
    this.id_subcat = this._activeRoute.snapshot.paramMap.get('id_sub')!
    this._catalogueService.checkExists()
      .subscribe((res: boolean) => {
        if(res) {
          this.name_category = this._catalogueService.getCategoryName(Number(this.id_category))
          this.name_subcat = this._catalogueService.getSubcatName(Number(this.id_category), Number(this.id_subcat))
          this.category_link = "inicio/"+this._catalogueService.getCategoryLink(Number(this.id_category))
          this.subcat_link = "inicio/"+this._catalogueService.getSubcatLink(Number(this.id_category), Number(this.id_subcat))
        }
      })
  }

  async getSubcatProducts() {
    this.subcategory_products = []
    var resp = await this._catalogueService.getCategoryProducts(this.id_category, this.id_subcat).toPromise();
    if(resp && !resp.msg) {
      this.productsExist = true;
      this.productsArray(resp.products);
      this.paginator._changePageSize(10);
    }
    else{
      this.productsExist = false;
    }
  }

  productsArray(products: any[]) {
    for(var i=0; i<products.length;i++) {
      if(!products[i].removed) {
        var newProd: Product = {
          amount: products[i].amount,
          brand: products[i].brand,
          description: products[i].description,
          id: products[i].id,
          name: products[i].name,
          url: `${this._baseUrl}${products[i].url}`,
          value: products[i].value,
          nav: `inicio/catalogo/${this.id_category}/${this.id_subcat}/producto/${products[i].id}`
        };
        this.subcategory_products.push(newProd);
      }
    }
    this.products_to_show = this.subcategory_products;
  }

  onPageChange(event: PageEvent) {
    this.products_to_show =  this.subcategory_products.slice(event.pageIndex*event.pageSize, event.pageIndex*event.pageSize + event.pageSize);
    window.location.hash = '#top';
  }

}
