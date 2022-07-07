import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { Category } from '../../../../interfaces/category.interface';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-category',
  templateUrl: './register-category.component.html',
  styleUrls: ['./register-category.component.css']
})
export class RegisterCategoryComponent implements OnInit {

  type: string = this.data.type;
  subtype: string = this.data.subtype;

  selected_ctg: string = '2';

  categories: Category[] = [];

  newCtg: FormGroup = this._fb.group({
    name: [, [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern('^[a-zA-ZÁÉÍÓÚÑáéíóúñü \'\-]+$')]],
    description: ['', [Validators.minLength(0), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñü., \'\-\(\)]+$')]],
  })

  constructor(private _dialogRef: MatDialogRef<RegisterCategoryComponent>,
              private _matDialog: MatDialog,
              private _fb: FormBuilder,
              private _catalogueService: CatalogueService,
              private _dataService: DataManagerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.type === 'edit') {
      this.newCtg.controls['name'].setValue(this.data.element.name);
      this.newCtg.controls['description'].setValue(this.data.element.description);
      if(this.subtype === 'subctg') {
        this.selected_ctg = this.data.element.id_category
      }
    }
    if(this.subtype === 'subctg') {
      this.getCategories()
    }
  }

  validField(field: string) {
    return this.newCtg.controls[field].errors
      && this.newCtg.controls[field].touched;
  }

  addCtgWarning() {
    if(this.newCtg.invalid) {
      return this.newCtg.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea agregar la categoría al sistema?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.addCtg(this.newCtg.value.name, this.newCtg.value.description)
        }
      })
    }
  }

  editCtgWarning() {
    if(this.newCtg.invalid) {
      return this.newCtg.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea editar la categoría?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.editCtg(this.data.element.id, this.newCtg.value.name, this.newCtg.value.description)
        }
      })
    }
  }

  addSubctgWarning() {
    if(this.newCtg.invalid) {
      return this.newCtg.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea agregar la subcategoría al sistema?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.addSubctg(this.newCtg.value.name, this.newCtg.value.description, Number(this.selected_ctg))
        }
      })
    }
  }

  editSubctgWarning() {
    if(this.newCtg.invalid) {
      return this.newCtg.markAllAsTouched();
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea editar la subcategoría?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.editSubctg(this.data.element.id, this.newCtg.value.name, this.newCtg.value.description)
        }
      })
    }
  }

  async getCategories() {
    var res = await lastValueFrom(this._catalogueService.getCategories())
    if(res) {
      this.categories = res;
      if(this.type === 'add') {
        this.selected_ctg = this.categories[0].id.toString()
      }
    }
  }

  async addCtg(name: string, des: string) {
    try {
      var res = await lastValueFrom(this._dataService.createCategory(name, des))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  async editCtg(id: number, name: string, des: string) {
    try {
      var res = await lastValueFrom(this._dataService.modifyCategory(id, name, des))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  async addSubctg(name: string, des: string, id_cat: number) {
    try {
      var res = await lastValueFrom(this._dataService.createSubcategory(name, des, id_cat))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  async editSubctg(id: number, name: string, des: string) {
    try {
      var res = await lastValueFrom(this._dataService.modifySubcategory(id, name, des))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
    }
  }

  close() {
    this._dialogRef.close()
  }

}
