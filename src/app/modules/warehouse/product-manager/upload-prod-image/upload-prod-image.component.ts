import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';

@Component({
  selector: 'app-upload-prod-image',
  templateUrl: './upload-prod-image.component.html',
  styleUrls: ['./upload-prod-image.component.css']
})
export class UploadProdImageComponent implements OnInit {

  name_file: string = 'Suba archivo png...'
  file: File | null =  null;

  constructor(private _dialogRef: MatDialogRef<UploadProdImageComponent>,
              private _matDialog: MatDialog,
              private _dataService: DataManagerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  validField(): boolean {
    if(this.file == null) {
      return true;
    }
    else {
      return false
    }
  }

  fileToUpload(event: Event) {
    const file = event.target as HTMLInputElement
    if(file!.files![0]) {
      this.name_file = file!.files![0].name;
      this.file = file!.files![0];
    }
  }

  addImageProdWarning() {
    if(this.validField()) {
      return
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea agregar la imagen al producto?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.addImageProd()
        }
      })
    }
  }

  addImageProd() {
    const reader = new FileReader()
    reader.readAsDataURL(this.file!);
    reader.onload = (event) => {
      this.uploadImage(reader.result as string, this.data.id)
    }
  }
  
  async uploadImage(b64: string, id: number) {
    try {
      var res = await lastValueFrom(this._dataService.uploadImageProduct(b64, id))
      if(res) {
        this._dialogRef.close({ data: { message: res.body.msg, status: res.status } });
      }
    }
    catch(error) {
      var errorSt = error as HttpErrorResponse
      if(errorSt.status === 413) {
        this._dialogRef.close({ data: { message: 'Imagen pesa demasiado. Error al subir la imagen al sistema.', status: errorSt.status } });
      }
      else {
        this._dialogRef.close({ data: { message: errorSt.error.msg, status: errorSt.status } });
      }
    }
  }

  close() {
    this._dialogRef.close()
  }

}
