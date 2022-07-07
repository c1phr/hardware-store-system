import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-warehouse-dashboard',
  templateUrl: './warehouse-dashboard.component.html',
  styleUrls: ['./warehouse-dashboard.component.css']
})
export class WarehouseDashboardComponent implements OnInit {

  name: string = ''

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.name = this._authService.getName()
  }

}
