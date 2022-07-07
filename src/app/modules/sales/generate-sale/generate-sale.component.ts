import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/interfaces/product.interface';
import { CatalogueService } from '../../../services/catalogue.service';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';
import { ConfirmSaleDialogComponent } from './confirm-sale-dialog/confirm-sale-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-generate-sale',
  templateUrl: './generate-sale.component.html',
  styleUrls: ['./generate-sale.component.css']
})
export class GenerateSaleComponent implements OnInit, AfterViewInit {
  @ViewChild('dataTable', { static: false }) myTable?: MatTable<any>;
  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = ['image','name', 'brand', 'value', 'amount', 'actions']
  pageSizeOptions: number[] = [10, 20, 50];

  search_results: Product[] = []
  dataSource = new MatTableDataSource();

  sale_type: string = ''
  id_salesman: string = ''

  id_sale: string = ''

  sale_data: any[] = [];

  newSaleForm: FormGroup = this._fb.group({
    rut: [,[Validators.required, Validators.minLength(8), Validators.maxLength(13), Validators.pattern("^([0-9]{7,8}-[0-9kK])$")]],
  })

  continueSaleForm: FormGroup = this._fb.group({
    id_sale: [, [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]],
  })

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  input_regex: string = `[a-zA-ZÁÉÍÓÚÑáéíóúñü '-]+`
  filterValue: string = ''

  constructor(private _fb: FormBuilder,
              private _sb: MatSnackBar,
              private _matDialog: MatDialog,
              private _authService: AuthService,
              private _dataService: DataManagerService,
              private _catalogueService: CatalogueService) { }

  ngOnInit(): void {
    this.id_salesman = this._authService.getID()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  resetType() {
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea volver a la página de selección? Recuerde guardar el ID de la venta para continuar en un futuro.`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.sale_type = '';
      }
    })
  }

  validFieldNew(field: string) {
    return this.newSaleForm.controls[field].errors
      && this.newSaleForm.controls[field].touched;
  }

  checkIfSame(): boolean {
    return (this.newSaleForm.value.rut === this.id_salesman)
  }

  validFieldContinue(field: string) {
    return this.continueSaleForm.controls[field].errors
      && this.continueSaleForm.controls[field].touched;
  }

  startNewSale() {
    if(this.newSaleForm.invalid || this.newSaleForm.value.rut === this.id_salesman) {
      return this.newSaleForm.markAllAsTouched();
    }
    else {
      this.sale_data = [];
      this.sendNewSale()
    }
  }

  continueSale() {
    if(this.continueSaleForm.invalid) {
      return this.continueSaleForm.markAllAsTouched();
    }
    else {
      this.id_sale = this.continueSaleForm.value.id_sale;
      this.sendSaleRequest()
    }
  }

  async sendNewSale() {
    try {
      var res = await lastValueFrom(this._dataService.newSale(this.newSaleForm.value.rut, this.id_salesman))
      if(res) {
        if(res.status === 200){
          this.id_sale = res.body.id;
          this.openSnackBar('Se inicio la venta con éxito.', this.configSuccess)
          this.sale_type = 'new'
        }
        else {
          this.openSnackBar(res.body.msg, this.configError)
        }
      }
      else {
        this.openSnackBar('No se pudo iniciar la venta.', this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }


  async sendSaleRequest() {
    try {
      var res = await lastValueFrom(this._dataService.continueSale(this.continueSaleForm.value.id_sale))
      if(res) {
        if(res.status === 200){
          if(!res.body.msg) {
            this.sale_data = res.body;
          }
          this.openSnackBar('Se obtuvo la venta con éxito.', this.configSuccess)
          this.sale_type = 'continue'
        }
        else {
          this.openSnackBar(res.body.msg, this.configError)
        }
      }
      else {
        this.openSnackBar('No se pudo obtener la venta.', this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  async checkSaleUpdate() {
    try {
      var res = await lastValueFrom(this._dataService.continueSale(this.id_sale))
      if(res) {
        if(res.status === 200){
          if(!res.body.msg) {
            this.sale_data = res.body;
          }
        }
      }
      else {
        this.openSnackBar('Error en la actualización de la venta.', this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  async searchProduct(param: string) {
    this.search_results = [];
    var respSearch = await lastValueFrom(this._catalogueService.searchProduct(param))
    if(respSearch) {
      this.search_results = respSearch;
      this.dataSource.data = this.search_results;
      this.myTable?.renderRows();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  openAddProductDialog(stock: number, id: number) {
    const popupRef = this._matDialog.open(AddProductDialogComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      data: {
        id_sale: this.id_sale,
        id_product: id,
        stock: stock,
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe((res) => {
      if(res) {
        return (res.data.status === 200)
          ? (this.openSnackBar(res.data.message, this.configSuccess), this.checkSaleUpdate())
          : (this.openSnackBar(res.data.message, this.configError), this.checkSaleUpdate())
      }
      else {
        return
      }
    })
  }

  warnRemoveProduct(id: number) {
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: '¿Está seguro que desea eliminar el producto de la compra?'
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe((res) => {
      if(res.data.answer) {
        this.removeProduct(id);
      }
    })
  }

  async removeProduct(id: number) {
    try {
      var res = await lastValueFrom(this._dataService.removeProductFromSale(this.id_sale, id))
      if(res) {
        if(res.status === 200){
          this.checkSaleUpdate()
          return this.openSnackBar(res.body.msg, this.configSuccess)
        }
        else {
          return this.openSnackBar(res.body.msg, this.configError)
        }
      }
      else {
        return this.openSnackBar('Error al remover producto.', this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

  search(event: any) {
    if(event) {
      this.searchProduct(this.filterValue)
    }
    
  }

  getAbsoluteTotal(): number {
    var total = 0;
    this.sale_data.forEach(x => total = total + x.price)
    return total;
  }

  startConfirmation() {
    const popupRef = this._matDialog.open(ConfirmSaleDialogComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      data: {
        id_sale: this.id_sale,
        total: this.getAbsoluteTotal()
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe((res) => {
      if(res) {
        return (res.data.status === 200)
          ? (this.openSnackBar('Se ha realizado la compra.', this.configSuccess), this.checkSaleUpdate())
          : (this.openSnackBar(res.data.message, this.configError), this.checkSaleUpdate())
      }
      else {
        return
      }
    })
  }

  addWishlistWarning() {
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: '¿Está seguro que desea agregar la wishlist a la compra?'
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe((res) => {
      if(res.data.answer) {
        this.addWishlistProducts();
      }
    })
  }

  async addWishlistProducts() {
    try {
      var res = await lastValueFrom(this._dataService.addWantedProducts(this.newSaleForm.value.rut, this.id_sale))
      if(res) {
        if(res.status === 200){
          this.checkSaleUpdate()
          return this.openSnackBar(res.body.msg, this.configSuccess)
        }
        else {
          return this.openSnackBar(res.body.msg, this.configError)
        }
      }
      else {
        return this.openSnackBar('Error al intentar agregar la wishlist.', this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

}
