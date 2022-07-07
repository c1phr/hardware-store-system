import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CatalogueService } from '../../../services/catalogue.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Category, Subcategory } from '../../../interfaces/category.interface';
import { ChangeContext, LabelType, Options } from '@angular-slider/ngx-slider';
import { MatDialog } from '@angular/material/dialog';
import { RegisterProductComponent } from './register-product/register-product.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { CommsService } from '../../../services/comms.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UploadProdImageComponent } from './upload-prod-image/upload-prod-image.component';

export interface MinMaxRange {
  min: number,
  max: number
}

export interface FilterAttributes {
  name?: string,
  brand?: string,
  id_category?: number,
  id_subcategory?: number,
  value: MinMaxRange,
  amount: MinMaxRange,
  stockmin: MinMaxRange,
  removed?: boolean
}

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('dataTable', { static: false }) myTable?: MatTable<any>;
  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = ['name', 'brand', 'category', 'sub_category', 'value', 'amount', 'stockmin', 'removed', 'actions']
  pageSizeOptions: number[] = [10, 20, 50];

  products_list: Product[] = []
  filtered_products: Product[] = []
  categories: Category[] = []
  sub_categories: Subcategory[] = []
  filtered_sub_categories: Subcategory[] = []
  brands: string[] = []

  dataSource = new MatTableDataSource(this.filtered_products);

  searchJson: FilterAttributes = {
    name: undefined,
    brand: '',
    id_category: -1,
    id_subcategory: -1,
    value: {min: 0, max: 1000000},
    amount: {min: 0, max: 1000000},
    stockmin: {min: 0, max: 1000000},
    removed: false
  }

  value_slider_options: Options = {
    floor: 0,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        default:
          return "$" + value;
      }
    }
  }

  amount_slider_options: Options = {
    floor: 0
  }

  stock_slider_options: Options = {
    floor: 0,
  }

  show_value_range: boolean = false;
  show_amount_range: boolean = false;
  show_stock_range: boolean = false;

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  loading_spinner: boolean = true;

  restockChangeSub: Subscription | undefined = undefined;

  input_regex: string = `[a-zA-ZÁÉÍÓÚÑáéíóúñü '-]+`

  constructor(private _catalogueService: CatalogueService,
              private _matDialog: MatDialog,
              private _sb: MatSnackBar,
              private _dataService: DataManagerService,
              private _commsService: CommsService) {
                this.restockChangeSub = this._commsService.restockChange$
                  .subscribe($event =>
                    this.receiveChange($event))
               }

  ngOnInit(): void {
    this.getCategories()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getProducts() {
    this.loading_spinner = true;
    var res = await lastValueFrom(this._catalogueService.getProducts())
    if(res) {
      this.products_list = res
      this.brands = this.products_list.map(x => x.brand).filter((value, index, self) => self.indexOf(value) === index)

      this.searchJson.value = {min:0,max: Math.max(...this.products_list.map(x => x.value))}
      //this.searchJson.value = this.value_range;
      this.value_slider_options.ceil = this.searchJson.value.max;
      this.show_value_range = true;

      this.searchJson.amount = {min:0,max: Math.max(...this.products_list.map(x => x.amount))}
      //this.searchJson.amount = this.amount_range;
      this.amount_slider_options.ceil = this.searchJson.amount.max;
      this.show_amount_range = true;
      
      this.searchJson.stockmin = {min:0,max: Math.max(...this.products_list.map(x => x.stockmin!))}
      //this.searchJson.stockmin = this.stockmin_range;
      this.stock_slider_options.ceil = this.searchJson.stockmin.max;
      this.show_stock_range = true;

      this.productsNavLink()
    }
  }

  async getCategories() {
    var resCat = await lastValueFrom(this._catalogueService.getCategories())
    var resSubCat = await lastValueFrom(this._catalogueService.getSubCategories())
    if(resCat && resSubCat) {
      this.categories = resCat
      this.sub_categories = resSubCat
      this.filtered_sub_categories = this.sub_categories
    }
    this.getProducts()
  }

  productsNavLink() {
    for(var i=0; i<this.products_list.length;i++) {
      this.products_list[i].nav = `inicio/catalogo/${this.products_list[i].id_category}/${this.products_list[i].id_subcategory}/producto/${this.products_list[i].id}`
    }
    this.filtered_products = this.products_list
    this.dataSource.data = this.filtered_products;
    this.loading_spinner = false;
    this.myTable?.renderRows();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  removeWarning(event: MatSlideToggleChange, id: number) {
    var action = 'desactivar'
    if(event.checked) {
      action = 'activar'
    }
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea ${action} el producto?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.toggleRemove(!event.checked, id)
      }
      else {
        this.checkUpdate()
      }
    })
  }

  async toggleRemove(removed: boolean, id: number) {
    try {
      var res = await lastValueFrom(this._dataService.changeProductStatus(id, removed));
      if(res) {
        return (res.status === 200)
          ? (this.openSnackBar(res.body.msg, this.configSuccess), this.checkUpdate())
          : (this.openSnackBar(res.body.msg, this.configError), this.checkUpdate())
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
      this.checkUpdate()
    }
  }

  getCategoryName(id: number) {
    return this.categories.find(x => x.id === id)!.name
  }

  getSubCategoryName(id: number) {
    return this.sub_categories.find(x => x.id === id)!.name
  }

  filterName(event: any) {
    //this.searchJson.name = (event.target as HTMLInputElement).value;
    if(event) {
      this.filterTable(this.searchJson)
    }
  }

  filterBrand(event: Event) {
    //this.searchJson.brand = (event.target as HTMLInputElement).value;
    this.filterTable(this.searchJson)
  }

  filterCategory(event: Event) {
    var id = Number((event.target as HTMLInputElement).value)
    if(id > -1) {
      this.filtered_sub_categories = this.sub_categories.filter(x => x.id_category === id)
      this.searchJson.id_category = id;
      this.searchJson.id_subcategory = undefined;
      this.filterTable(this.searchJson)
    }
    else {
      this.filtered_sub_categories = this.sub_categories
      this.searchJson.id_category = undefined;
      this.filterTable(this.searchJson)
    }
  }

  filterSubCategory(event: Event) {
    var id = Number((event.target as HTMLInputElement).value)
    if(id > -1) {
      this.searchJson.id_subcategory = id;
      this.filterTable(this.searchJson)
    }
    else {
      this.searchJson.id_subcategory = undefined;
      this.filterTable(this.searchJson)
    }
  }

  filterValue(event: ChangeContext) {
    this.searchJson.value.min = event.value;
    this.searchJson.value.max = event.highValue!;
    this.filterTable(this.searchJson)
  }

  filterAmount(event: ChangeContext) {
    this.searchJson.amount.min = event.value;
    this.searchJson.amount.max = event.highValue!;
    this.filterTable(this.searchJson)
  }

  filterStock(event: ChangeContext) {
    this.searchJson.stockmin.min = event.value;
    this.searchJson.stockmin.max = event.highValue!;
    this.filterTable(this.searchJson)
  }

  filterRemoved(event: MatSlideToggleChange) {
    this.filterTable(this.searchJson)
  }

  filterTable(search: FilterAttributes) {
    this.filtered_products = this.products_list;
    if(search.name) {
      this.filtered_products = this.filtered_products.filter(x => (x.name.trim().toLowerCase().includes(search.name!.trim().toLowerCase())))
    }
    if(search.brand) {
      this.filtered_products = this.filtered_products.filter(x => (x.brand.trim().toLowerCase().includes(search.brand!.trim().toLowerCase())))
    }
    if(search.id_category && search.id_category > -1) {
      this.filtered_products = this.filtered_products.filter(x => (x.id_category === search.id_category))
    }
    if(search.id_subcategory && search.id_subcategory > -1) {
      this.filtered_products = this.filtered_products.filter(x => (x.id_subcategory === search.id_subcategory))
    }
    if(search.value) {
      this.filtered_products = this.filtered_products.filter(x => (x.value >= search.value!.min && x.value <= search.value!.max))
    }
    if(search.amount) {
      this.filtered_products = this.filtered_products.filter(x => (x.amount >= search.amount!.min && x.amount <= search.amount!.max))
    }
    if(search.stockmin) {
      this.filtered_products = this.filtered_products.filter(x => (x.stockmin! >= search.stockmin!.min && x.stockmin! <= search.stockmin!.max))
    }
    if(search.removed) {
      this.filtered_products = this.filtered_products.filter(x => (x.removed! === search.removed!))
    }
    this.dataSource.data = this.filtered_products;
  }

  clearFilters() {
    this.searchJson = {
      name: undefined,
      brand: '',
      id_category: -1,
      id_subcategory: -1,
      value: {min: 0, max: this.value_slider_options.ceil!},
      amount: {min: 0, max: this.amount_slider_options.ceil!},
      stockmin: {min: 0, max: this.stock_slider_options.ceil!},
      removed: false
    }
    this.filterTable(this.searchJson)
  }

  openDialog(index: number, element?: Product) {
    if(index != -1) {
      const popupRef = this._matDialog.open(RegisterProductComponent, {
        autoFocus: false,
        panelClass: ['register-product-dialog'],
        data: {
          type: 'edit',
          product: element
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res) {
          return (res.data.status === 200)
            ? (this.openSnackBar(res.data.message, this.configSuccess), this.checkUpdate(), this.sendChange('Cambio stock', 201))
            : (this.openSnackBar(res.data.message, this.configError), this.checkUpdate())
        }
      })
    }
    else {
      const popupRef = this._matDialog.open(RegisterProductComponent, {
        autoFocus: false,
        panelClass: ['register-product-dialog'],
        data: {
          type: 'add'
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res) {
          return (res.data.status === 200)
            ? (this.openSnackBar(res.data.message, this.configSuccess), this.checkUpdate(), this.sendChange('Cambio stock', 201))
            : (this.openSnackBar(res.data.message, this.configError), this.checkUpdate())
        }
      })
    }
    
  }

  openImageDialog(prod_id: number) {
    const popupRef = this._matDialog.open(UploadProdImageComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      disableClose: true,
      data: {
        id: prod_id
      }
    });
    popupRef.afterClosed().subscribe(res => {
      if(res) {
        if (res.data.status === 200) {
          this.openSnackBar(res.data.message, this.configSuccess);
          this.getCategories()
        }
        else {
          this.openSnackBar(res.data.message, this.configError);
          this.getCategories()
        }
      }
    })
  }

  checkUpdate() {
    this.products_list = [];
    this.filtered_products = this.products_list
    var id = 1;
    this.getProducts()
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

  sendChange(msg: string, status: number) {
    this._commsService.createDbProdChange({ msg: msg, status: status })
  }
  
  receiveChange(event: any) {
    if(event.status === 202) {
      this.checkUpdate()
    }
  }

}
