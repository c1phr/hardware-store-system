import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommsService {



  private _dbProduct = new Subject<any>();
  readonly dbProductChange$ = this._dbProduct.asObservable()

  private _restock = new Subject<any>();
  readonly restockChange$ = this._restock.asObservable()

  private _confirmStatus = new BehaviorSubject(false);
  readonly confirmStatusChange$ = this._confirmStatus.asObservable();

  constructor() { }

  createDbProdChange(json: any) {
    this._dbProduct.next(json)
  }

  createRestockChange(json: any) {
    this._restock.next(json)
  }

  createConfirmChange(status: boolean) {
    this._confirmStatus.next(status)
  }

}
