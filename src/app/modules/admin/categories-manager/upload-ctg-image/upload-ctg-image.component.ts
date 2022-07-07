import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DataManagerService } from 'src/app/services/data-manager.service';

@Component({
  selector: 'app-upload-ctg-image',
  templateUrl: './upload-ctg-image.component.html',
  styleUrls: ['./upload-ctg-image.component.css']
})
export class UploadCtgImageComponent implements OnInit {

  name_file: string = 'Suba archivo png...'
  file: File | null =  null;

  constructor(private _dialogRef: MatDialogRef<UploadCtgImageComponent>,
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

  addImageCtgWarning() {
    if(this.validField()) {
      return
    }
    else {
      const popupRef = this._matDialog.open(WarningDialogComponent, {
        autoFocus: false,
        panelClass: ['delete-warning-dialog'],
        data: {
          message: `¿Está seguro que desea agregar la imagen a la categoría?`
        },
        disableClose: true
      });
      popupRef.afterClosed().subscribe(res => {
        if(res.data.answer) {
          this.addImageCtg()
        }
      })
    }
  }

  addImageCtg() {
    const reader = new FileReader()
    reader.readAsDataURL(this.file!);
    reader.onload = (event) => {
      this.uploadImage(reader.result as string, this.data.id)
    }
  }
  
  async uploadImage(b64: string, id: number) {
    try {
      var res = await lastValueFrom(this._dataService.uploadImageCategory(b64, id))
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
