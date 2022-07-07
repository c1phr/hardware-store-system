import { Component, OnInit, ViewChild } from '@angular/core';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { lastValueFrom } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterSupplierComponent } from './register-supplier/register-supplier.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-suppliers-manager',
  templateUrl: './suppliers-manager.component.html',
  styleUrls: ['./suppliers-manager.component.css']
})
export class SuppliersManagerComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) myTable?: MatTable<any>;
  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = ['name', 'email', 'description', 'address', 'phone', 'state', 'actions']
  pageSizeOptions: number[] = [10, 20, 50];

  suppliers_list: any[] = []
  dataSource = new MatTableDataSource(this.suppliers_list);

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  loading_spinner: boolean = true;

  input_regex: string = `[a-zA-ZÁÉÍÓÚÑáéíóúñü '-]+`
  supFilterValue: string = ''

  filterActive: string = '-1';

  constructor(private _dataService: DataManagerService,
              private _matDialog: MatDialog,
              private _sb: MatSnackBar) { }
  

  ngOnInit(): void {
    this.getSuppliersList()
  }

  async getSuppliersList() {
    this.loading_spinner = true;
    try {
      var res = await lastValueFrom(this._dataService.getSuppliers())
      if(res) {
        this.suppliers_list = res;
        this.loading_spinner = false;
        this.dataSource.data = this.suppliers_list
      }
    }
    catch(error) {
    }
  }

  toggleActiveWarning(event: MatSlideToggleChange, id: number) {
    var ban = event.checked
    var action = 'desactivar'
    if(ban) {
      action = 'activar'
    }
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea ${action} al proveedor ${name} del sistema?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.toggleSupplier(id, !ban)
      }
      else {
        this.getSuppliersList()
      }
    })
  }

  registerSupplierDialog() {
    const popupRef = this._matDialog.open(RegisterSupplierComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      disableClose: true,
      data: {
        type: 'add'
      }
    });
    popupRef.afterClosed().subscribe(res => {
      if(res) {
        if (res.data.status === 200) {
          this.openSnackBar(res.data.message, this.configSuccess);
          this.getSuppliersList()
        }
        else {
          this.openSnackBar(res.data.message, this.configError);
          this.getSuppliersList()
        }
      }
    })
  }

  editSupplierDialog(supplier: any) {
    const popupRef = this._matDialog.open(RegisterSupplierComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      disableClose: true,
      data: {
        type: 'edit',
        sup: supplier
      }
    });
    popupRef.afterClosed().subscribe(res => {
      if(res) {
        if (res.data.status === 200) {
          this.openSnackBar(res.data.message, this.configSuccess);
          this.getSuppliersList()
        }
        else {
          this.openSnackBar(res.data.message, this.configError);
          this.getSuppliersList()
        }
      }
    })
  }

  async toggleSupplier(id: number, ban: boolean) {
    try {
      var res = await lastValueFrom(this._dataService.toggleActiveSupplier(id, ban))
      if(res) {
        this.openSnackBar(res.body.msg, this.configSuccess)
        this.getSuppliersList()
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  applyFilter(event: any) {
    if(event) {
      this.dataSource.filter = this.supFilterValue.trim().toLowerCase()
    }
  }

  filterActiveSupplier() {
    return (Number(this.filterActive) === -1)
      ? (this.dataSource.data = this.suppliers_list)
      : (this.dataSource.data = this.suppliers_list.filter(x=> x.removed === !!Number(this.filterActive)))
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
