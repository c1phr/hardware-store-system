import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/interfaces/product.interface';
import { DataManagerService } from '../../../services/data-manager.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { Category, Subcategory } from 'src/app/interfaces/category.interface';
import { CatalogueService } from '../../../services/catalogue.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeStockDialogComponent } from 'src/app/components/change-stock-dialog/change-stock-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CommsService } from '../../../services/comms.service';

@Component({
  selector: 'app-stock-manager',
  templateUrl: './stock-manager.component.html',
  styleUrls: ['./stock-manager.component.css']
})
export class StockManagerComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) myTable?: MatTable<any>;
  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = ['image', 'name', 'category', 'sub_category', 'value', 'amount', 'stockmin', 'actions']
  pageSizeOptions: number[] = [10, 20, 50];

  stock_prod_list: Product[] = []
  categories: Category[] = []
  sub_categories: Subcategory[] = []

  dataSource = new MatTableDataSource(this.stock_prod_list);

  loading_spinner: boolean = true;

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  input_regex: string = `[a-zA-ZÁÉÍÓÚÑáéíóúñü '-]+`
  ctgFilterValue: string = ''

  restockChangeSub: Subscription | undefined = undefined;

  constructor(private _dataService: DataManagerService,
              private _catalogueService: CatalogueService,
              private _matDialog: MatDialog,
              private _sb: MatSnackBar,
              private _commsService: CommsService) {
                this.restockChangeSub = this._commsService.restockChange$
                  .subscribe($event =>
                    this.receiveChange($event))
               }

  ngOnInit(): void {
    this.getCategories()
  }

  async getCategories() {
    var resCat = await lastValueFrom(this._catalogueService.getCategories())
    if(resCat) {
      this.categories = resCat
      this.getSubcategories()
    }
  }

  async getSubcategories() {
    var resSubCat = await lastValueFrom(this._catalogueService.getSubCategories())
    if(resSubCat) {
      this.sub_categories = resSubCat
      this.getStockMinList()
    }
  }

  async getStockMinList() {
    this.loading_spinner = true;
    var res = await lastValueFrom(this._dataService.getStockMinList())
    if(res) {
      this.stock_prod_list = res.body;
      this.loading_spinner = false;
      this.dataSource.data = this.stock_prod_list;
      this.myTable?.renderRows()
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }
  }

  applyFilter(event: any) {
    if(event) {
      this.dataSource.filter = this.ctgFilterValue.trim().toLowerCase()
    }
  }

  getCategoryName(id: number): string {
    var name = this.categories.find(x => x.id === id)!.name
    return name
  }

  getSubcategoryName(id: number): string {
    var name = this.sub_categories.find(x => x.id === id)!.name
    return name
  }


  openRestockDialog(id: number, amount: number, stockmin: number, name: string) {
    const dialogRestock = this._matDialog.open(ChangeStockDialogComponent, {
      autoFocus: false,
      maxWidth: 340,
      panelClass: ['register-product-dialog'],
      data: {
        id: id,
        amount: amount,
        stockmin: stockmin,
        name: name
      }
    });
    dialogRestock.afterClosed().subscribe(res => {
      if(res) {
        return (res.data.status === 200)
          ? (this.openSnackBar(res.data.message, this.configSuccess), this.getStockMinList(), this.sendChange(res.data.message, 201))
          : (this.openSnackBar(res.data.message, this.configError))
      }
    })
  }

  sendChange(msg: string, status: number) {
    this._commsService.createDbProdChange({ msg: msg, status: status })
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

  receiveChange(event: any) {
    if(event.status === 202) {
      this.getStockMinList()
    }
  }

}
