import { Component, OnInit, ViewChild } from '@angular/core';
import { DataManagerService } from '../../../services/data-manager.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../../auth/interfaces/auth.interface';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { RegisterUserComponent } from './register-user/register-user.component';

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.css']
})
export class UsersManagerComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) myTable?: MatTable<any>;
  @ViewChild('myPaginator', { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = ['rut', 'name', 'email', 'role', 'city', 'address', 'phone', 'state', 'actions']
  pageSizeOptions: number[] = [10, 20, 50];

  userFilter: string = '-1';

  users_list: Auth[] = []
  dataSource = new MatTableDataSource(this.users_list);

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
  userFilterValue: string = ''

  filterActive: string = '-1';


  constructor(private _dataService: DataManagerService,
              private _sb: MatSnackBar,
              private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsersList()
  }

  async getUsersList() {
    this.loading_spinner = true;
    try {
      var res = await lastValueFrom(this._dataService.getUsers())
      if(res) {
        this.users_list = res.body;
        this.dataSource.data = this.users_list;
        this.loading_spinner = false;
        this.myTable?.renderRows();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.openSnackBar(res.body.msg, this.configError)
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  applyFilter(event: any) {
    if(event) {
      this.dataSource.filter = this.userFilterValue.trim().toLowerCase()
    }
  }

  banWarning(event: MatSlideToggleChange, id: string) {
    var ban = event.checked
    var action = 'desactivar'
    if(ban) {
      action = 'activar'
    }
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea ${action} al usuario?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.toggleActive(id, !ban)
        this.getUsersList()
      }
      else {
        this.getUsersList()
      }
    })
  }

  passwordWarning(email: string) {
    const popupRef = this._matDialog.open(WarningDialogComponent, {
      autoFocus: false,
      panelClass: ['delete-warning-dialog'],
      data: {
        message: `¿Está seguro que desea regenerar la contraseña del usuario?`
      },
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res.data.answer) {
        this.resetPassword(email)
      }
    })
  }

  registerUserDialog() {
    const popupRef = this._matDialog.open(RegisterUserComponent, {
      autoFocus: false,
      panelClass: ['register-product-dialog'],
      disableClose: true
    });
    popupRef.afterClosed().subscribe(res => {
      if(res) {
        if (res.data.status === 200) {
          this.openSnackBar(res.data.message, this.configSuccess);
          this.getUsersList()
        }
        else {
          this.openSnackBar(res.data.message, this.configError);
          this.getUsersList()
        }
      }
    })
  }

  getRoleName(id: number): string {
    return (id === 1)
      ? 'Cliente'
      : (id === 2)
        ? 'Bodega'
        : (id === 3)
          ? 'Ventas'
          : (id === 4)
            ? 'Admin'
            : 'Desconocido'
  }

  async toggleActive(id: string, ban: boolean) {
    try {
      var res = await lastValueFrom(this._dataService.toggleUserActivation(id, ban))
      if(res) {
        this.openSnackBar(res.body.msg, this.configSuccess)
        this.getUsersList()
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  async resetPassword(email: string) {
    try {
      var res = await lastValueFrom(this._dataService.resetPassword(email))
      if(res) {
        this.openSnackBar(res.body.msg, this.configSuccess)
        this.getUsersList()
      }
    }
    catch(error) {
      this.openSnackBar((error as HttpErrorResponse).error.msg, this.configError)
    }
  }

  filterActiveUser() {
    return (Number(this.filterActive) === -1 && Number(this.userFilter) === -1)
      ? (this.dataSource.data = this.users_list)
      : (Number(this.filterActive) === -1 && Number(this.userFilter) != -1)
        ? (this.dataSource.data = this.users_list.filter(x => x.role === Number(this.userFilter)))
        : (Number(this.filterActive) != -1 && Number(this.userFilter) === -1)
          ? (this.dataSource.data = this.users_list.filter(x=> x.banned === !!Number(this.filterActive)))
          : (Number(this.filterActive) != -1 && Number(this.userFilter) != -1)
            ? (this.dataSource.data = this.users_list.filter(x=> x.banned === !!Number(this.filterActive)).filter(x => x.role === Number(this.userFilter)))
            : (this.dataSource.data = this.users_list)
  }

  openSnackBar(message: string, config: MatSnackBarConfig) {
    this._sb.open(message, 'CERRAR', config);
  }

}
