import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { Category, Subcategory } from 'src/app/interfaces/category.interface';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { DataManagerService } from '../../../services/data-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterCategoryComponent } from './register-category/register-category.component';
import { UploadCtgImageComponent } from './upload-ctg-image/upload-ctg-image.component';

@Component({
  selector: 'app-categories-manager',
  templateUrl: './categories-manager.component.html',
  styleUrls: ['./categories-manager.component.css']
})
export class CategoriesManagerComponent implements OnInit {
  @ViewChild('ctgDataTable', { static: false }) ctgTable?: MatTable<any>;
  @ViewChild('ctgPaginator', { static: false }) ctgPaginator!: MatPaginator;
  @ViewChild('subctgDataTable', { static: false }) subctgTable?: MatTable<any>;
  @ViewChild('subctgPaginator', { static: false }) subctgPaginator!: MatPaginator;
  @ViewChild('ctgMatSort', { static: false }) ctgSort!: MatSort;
  @ViewChild('subctgMatSort', { static: false }) subctgSort!: MatSort;

  ctgDisplayedColumns: string[] = ['name', 'description', 'removed', 'actions']
  subctgDisplayedColumns: string[] = ['name', 'description', 'category', 'removed', 'actions']
  pageSizeOptions: number[] = [10, 20, 50];

  configSuccess: MatSnackBarConfig = {
    duration: 3000,
    panelClass: ['success-sb']
  }

  configError: MatSnackBarConfig = {
    duration: 5000,
    panelClass: ['error-sb']
  }

  categories: Category[] = []
  sub_categories: Subcategory[] = []

  ctgDataSource = new MatTableDataSource(this.categories);
  subctgDataSource = new MatTableDataSource(this.sub_categories);

  loading_spinner_ctg: boolean = true;
  loading_spinner_subctg: boolean = true;

  input_regex: string = `[a-zA-ZÁÉÍÓÚÑáéíóúñü '-]+`
  ctgFilterValue: string = ''
  subctgFilterValue: string = ''

  filterCtgActive: string = '-1'
  filterSubctgActive: string = '-1'

  constructor(private _catalogueService: CatalogueService,
              private _dataService: DataManagerService,
              private _matDialog: MatDialog,
              private _sb: MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories()
  }

  async getCategories() {
    this.loading_spinner_ctg = true;
    var resCat = await lastValueFrom(this._catalogueService.getCategories())
    if(resCat) {
      this.categories = resCat
      this.categories.forEach(x=> x.url = '')
      this.ctgDataSource.data = this.categories;

      this.ctgTable?.renderRows();
      this.ctgDataSource.paginator = this.ctgPaginator;
      this.ctgDataSource.sort = this.ctgSort;

      this.loading_spinner_ctg = false;
      this.getSubcategories()
    }
  }

  async getSubcategories() {
    this.loading_spinner_subctg = true;
    var resSubCat = await lastValueFrom(this._catalogueService.getSubCategories())
    if(resSubCat) {
      this.sub_categories = resSubCat
      this.sub_categories.forEach(x=> x.url = '')
      this.subctgDataSource.data = this.sub_categories

      this.subctgTable?.renderRows();
      this.subctgDataSource.paginator = this.subctgPaginator;
      this.subctgDataSource.sort = this.subctgSort;

      this.loading_spinner_subctg = false;
    }
  }

  removeCtgWarning(event: MatSlideToggleChange, id: number) {
    var ban = event.checked
    var action = 'desactivar'
    if(ban) {
      action = 'activar'
    }
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea ${action} la categoría?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.toggleActiveCtg(id, !ban)
        this.getCategories()
      }
      else {
        this.getCategories()
      }
    })
  }

  removeSubctgWarning(event: MatSlideToggleChange, id: number) {
    var ban = event.checked
    var action = 'desactivar'
    if(ban) {
      action = 'activar'
    }
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea ${action} la subcategoría?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.toggleActiveSubctg(id, !ban)
        this.getSubcategories()
      }
      else {
        this.getSubcategories()
      }
    })
  }

  openCtgDialog(type: string, subtype: string, element?: any) {
    const popupRef = this._matDialog.open(RegisterCategoryComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      disableClose: true,
      data: {
        type: type,
        subtype: subtype,
        element: element
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

  openImageDialog(ctg_id: number) {
    const popupRef = this._matDialog.open(UploadCtgImageComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      disableClose: true,
      data: {
        id: ctg_id
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

  async toggleActiveCtg(id: number, removed: boolean) {
    try {
      var res = await lastValueFrom(this._dataService.toggleActiveCategory(id, removed))
      if(res) {
        this.openSnackBar(res.body.msg, this.configSuccess)
        this.getCategories()
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  async toggleActiveSubctg(id: number, removed: boolean) {
    try {
      var res = await lastValueFrom(this._dataService.toggleActiveSubcategory(id, removed))
      if(res) {
        this.openSnackBar(res.body.msg, this.configSuccess)
        this.getSubcategories()
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  getCategoryName(id: number): string {
    var name = this.categories.find(x => x.id === id)!.name
    return name
  }

  applyFilterCtg(event: any) {
    if(event) {
      this.ctgDataSource.filter = this.ctgFilterValue.trim().toLowerCase()
    }
  }

  applyFilterSubctg(event: any) {
    if(event) {
      this.subctgDataSource.filter = this.subctgFilterValue.trim().toLowerCase()
    }
  }

  filterActiveCtg() {
    return (Number(this.filterCtgActive) === -1)
      ? (this.ctgDataSource.data = this.categories)
      : (this.ctgDataSource.data = this.categories.filter(x=> x.removed === !!Number(this.filterCtgActive)))
  }

  filterActiveSubctg() {
    return (Number(this.filterSubctgActive) === -1)
      ? (this.subctgDataSource.data = this.sub_categories)
      : (this.subctgDataSource.data = this.sub_categories.filter(x=> x.removed === !!Number(this.filterSubctgActive)))
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
