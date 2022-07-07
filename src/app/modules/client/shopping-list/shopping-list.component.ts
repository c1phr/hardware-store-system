import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from '../../../services/users.service';
import { lastValueFrom } from 'rxjs';
import { CommsService } from 'src/app/services/comms.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  original_wishlist: any[] = []
  wishlist: any[] = []

  total_wishlist: number = 0;

  checkLogged: boolean = false;
  message: string = 'Inicie sesión para ver su lista de productos deseados.'
  confirmed: boolean = false;

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _userService: UsersService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this.checkLogged = this._authService.isLoggedIn()
    this.getWishlist()
  }

  async getWishlist() {
    try {
      var res = await lastValueFrom(this._userService.getWishlist(this._authService.getID()))
      if(res) {
        if(res.body) {
          this.wishlist = [];
          this.original_wishlist = res.body;
          this.confirmed = this.original_wishlist[0].confirmcart
          this.wishlistArray();
        }
        else {
          this.message = res.body.msg
        }
      }
    }
    catch(error) {
      this.message = (error as HttpErrorResponse).error.msg
    }
  }

  wishlistArray() {
    for(var i=0; i<this.original_wishlist.length;i++) {
      var prod = {
        price: this.original_wishlist[i].price,
        amount: this.original_wishlist[i].amount,
        id_product: this.original_wishlist[i].id_product,
        name: this.original_wishlist[i].name,
        url: this.original_wishlist[i].url,
        nav: `/inicio/catalogo/${this.original_wishlist[i].category}/${this.original_wishlist[i].subcategory}/producto/${this.original_wishlist[i].id_product}`,
        changed: false
      }
      this.wishlist.push(prod)
    }
  }

  addProduct(i: number) {
    this.wishlist[i].amount++;
    if(this.original_wishlist[i].amount != this.wishlist[i].amount) {
      this.wishlist[i].changed = true;
    }
    else {
      this.wishlist[i].changed = false;
    }
  }

  subtractProduct(i: number) {
    if(this.wishlist[i].amount > 1) {
      this.wishlist[i].amount--;
    }
    if(this.original_wishlist[i].amount != this.wishlist[i].amount) {
      this.wishlist[i].changed = true;
    }
    else {
      this.wishlist[i].changed = false;
    }
  }

  getTotalProduct(price: number, amount: number): number {
    return price*amount;
  }


  async deleteProduct(id: number) {
    var res = await lastValueFrom(this._userService.removeProdWishlist(this._authService.getID(), id))
    if(res) {
      this.getWishlist()
    }
  }

  async modifyProduct(id: number, amount: number) {
    var res = await lastValueFrom(this._userService.editProdWishlist(this._authService.getID(), id, amount))
    if(res) {
      this.getWishlist()
    }
  }

  getTotalWishlist(): number {
    var total = 0;
    this.wishlist.forEach(x => total = total + x.amount*x.price)
    return total
  }

  async confirmWishlist() {
    if(this.wishlist.length > 0) {
      var res = await lastValueFrom(this._userService.changeStateWishlist(this._authService.getID(), true))
      if(res){
        this.getWishlist()
      }
    }
  }

}
