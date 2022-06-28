import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hardware-store-system';

  constructor(private _authService: AuthService,
              private _router: Router){}

  ngOnInit(): void {
    this._authService.searchEnc()
  }

  inStaff(): boolean {
    return (this._router.url.includes('/staff')) 
     ? true
     : false
  }
}
