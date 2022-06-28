import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { Category, Subcategory } from 'src/app/interfaces/category.interface';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { CatalogueService } from '../../../../services/catalogue.service';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.css']
})
export class RegisterProductComponent implements OnInit {

  type: string = this.data.type;

  categories: Category[] = []
  sub_categories: Subcategory[] = []
  filtered_sub_categories: Subcategory[] = []
  suppliers: any[] = []

  current_date: Date = new Date()

  editProductForm: FormGroup = this._fb.group({
    product_name: [,[Validators.required, Validators.minLength(7), Validators.maxLength(50)]],
    product_year: [,[Validators.required, Validators.min(1990), Validators.max(this.current_date.getFullYear())]],
    product_brand: [, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
    product_desc: [, [Validators.required, Validators.minLength(0), Validators.maxLength(1000)]],
    product_amount: [, [Validators.required, Validators.min(1), Validators.max(10000)]],
    product_value: [, [Validators.required, Validators.min(1), Validators.max(10000000)]],
    product_stockmin: [, [Validators.required, Validators.min(1), Validators.max(10000)]],
    id_category: [,[Validators.required, Validators.min(0)]],
    id_subcategory: [,[Validators.required, Validators.min(0)]],
    id_supplier: []
  })

  constructor(private _dialogRef: MatDialogRef<RegisterProductComponent>,
              private _matDialog: MatDialog,
              private _fb: FormBuilder,
              private _catalogueService: CatalogueService,
              private _dataService: DataManagerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getSuppliers()
    this.getCategories()
    if(this.data.product) {
      this.editProductForm.controls['product_name'].setValue(this.data.product.name);
      this.editProductForm.controls['product_year'].setValue(this.data.product.year);
      this.editProductForm.controls['product_brand'].setValue(this.data.product.brand);
      this.editProductForm.controls['product_desc'].setValue(this.data.product.description);
      this.editProductForm.controls['product_amount'].setValue(this.data.product.amount);
      this.editProductForm.controls['product_value'].setValue(this.data.product.value);
      this.editProductForm.controls['product_stockmin'].setValue(this.data.product.stockmin);
      this.editProductForm.controls['id_category'].setValue(this.data.product.id_category);
      this.editProductForm.controls['id_subcategory'].setValue(this.data.product.id_subcategory);
    }
  }

  async getCategories() {
    var resCat = await lastValueFrom(this._catalogueService.getCategories())
    var resSubCat = await lastValueFrom(this._catalogueService.getSubCategories())
    if(resCat && resSubCat) {
      this.categories = resCat.categorys
      this.sub_categories = resSubCat.subcategorys
      this.filtered_sub_categories = this.sub_categories.filter(x => x.id_category === this.categories[0].id)
    }
  }

  async getSuppliers() {
    var res = await lastValueFrom(this._dataService.getSuppliers())
    if(res) {
      this.suppliers = res.suppliers
    }
  }

  validFieldEdit(field: string) {
    return this.editProductForm.controls[field].errors
      && this.editProductForm.controls[field].touched;
  }

  selectCategory(event: Event) {
    var id = Number((event.target as HTMLInputElement).value)
    this.editProductForm.controls['id_category'].setValue(id);
    this.filtered_sub_categories = this.sub_categories.filter(x => x.id_category === id)
  }

  selectSubCategory(event: Event) {
    var id = Number((event.target as HTMLInputElement).value)
    this.editProductForm.controls['id_subcategory'].setValue(id);
  }

  selectSupplier(event: Event) {
    var id = Number((event.target as HTMLInputElement).value)
    this.editProductForm.controls['id_supplier'].setValue(id);
  }

  close() {
    this._dialogRef.close()
  }

  editProductWarning() {
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea editar los datos de este producto?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        var body = {
          id: this.data.product.id,
          name: this.editProductForm.value.product_name,
          year: this.editProductForm.value.product_year,
          brand: this.editProductForm.value.product_brand,
          description: this.editProductForm.value.product_desc,
          amount: this.editProductForm.value.product_amount,
          value: this.editProductForm.value.product_value,
          stockmin: this.editProductForm.value.product_stockmin
        }
        this.editProduct(body)
      }
    })
  }

  async editProduct(body: any) {
    var res = await lastValueFrom(this._dataService.modifyProducts(body))
    if(res) {
      this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
    }
  }

  addProductWarning() {
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea agregar el producto al sistema?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        var body = {
          name: this.editProductForm.value.product_name,
          year: this.editProductForm.value.product_year,
          brand: this.editProductForm.value.product_brand,
          description: this.editProductForm.value.product_desc,
          amount: this.editProductForm.value.product_amount,
          value: this.editProductForm.value.product_value,
          stockmin: this.editProductForm.value.product_stockmin,
          id_subcategory: this.editProductForm.value.id_subcategory,
          id_supplier: this.editProductForm.value.id_supplier
        }
        this.addProduct(body)
      }
    })
  }

  async addProduct(body: any) {
    var res = await lastValueFrom(this._dataService.addProduct(body))
    if(res) {
      this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
    }
  }

}