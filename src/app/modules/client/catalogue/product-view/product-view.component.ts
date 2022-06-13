import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/product.interface';
import { CatalogueService } from 'src/app/services/catalogue.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  selectedProduct: Product  = {
    amount: 0,
    brand: '',
    description: '',
    id: -1,
    name: '',
    url: '',
    value: 0,
    nav: ''
  };

  id_category: string = '';
  id_subcat: string = '';
  id_product: string = '';

  name_category: string = '';
  name_subcat: string = '';
  name_product: string = '';
  category_link: string = '';
  subcat_link: string = '';

  productExist: boolean = false;
  productChecked: boolean = false;

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _activeRoute: ActivatedRoute,
              private _catalogueService: CatalogueService,) {
                this._activeRoute.paramMap.subscribe(params => {
                  this.productChecked = false;
                  this.changeNameAndIDs()
                  this.getProduct()
                }); }

  ngOnInit(): void {
  }

  changeNameAndIDs() {
    this.id_category = this._activeRoute.snapshot.paramMap.get('id_cat')!
    this.id_subcat = this._activeRoute.snapshot.paramMap.get('id_sub')!
    this.id_product = this._activeRoute.snapshot.paramMap.get('id_product')!
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

  async getProduct() {
    var resp = await this._catalogueService.getProduct(this.id_product, this.id_category, this.id_subcat).toPromise();
    if(resp && !resp.msg) {
      console.log(resp)
      this.productExist = true;
      this.selectedProduct = resp.products[0];
      this.name_product = resp.products[0].name;
      this.selectedProduct!.url = this._baseUrl + resp.products[0].url;
      this.selectedProduct!.description = resp.products[0].description;
      this.productChecked = true;
    }
    else {
      this.productExist = false;
      this.productChecked = true;
    }
  }
}
