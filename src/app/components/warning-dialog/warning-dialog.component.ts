import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent implements OnInit {

  type: string = 'general';

  constructor(private _dialogRef: MatDialogRef<WarningDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if((this.data.type === 'add_specialist') || (this.data.type === 'edit_specialist')) {
      this.type = this.data.type;
    }
  }

  answerQuestion(answer: boolean) {
    this._dialogRef.close({ data: { answer: answer } });
  }

  close() {
    this._dialogRef.close({ data: { answer: false } })
  }

}
