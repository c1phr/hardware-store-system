import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from '../../../services/users.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  original_wishlist: any[] = []
  wishlist: any[] = []

  //wait_check: boolean = false;
  checkLogged: boolean = false;
  message: string = 'Inicie sesión para ver su lista de productos deseados.'

  private _baseUrl: string = 'https://sistemaventainventario.herokuapp.com/'

  constructor(private _userService: UsersService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this.checkLogged = this._authService.isLoggedIn()
    this.getWishlist()
  }

  async getWishlist() {
    var res = await lastValueFrom(this._userService.getWishlist(this._authService.getID()))
    if(res) {
      if(res.body.want) {
        this.wishlist = [];
        this.original_wishlist = res.body.want;
        this.wishlistArray();
        console.log(this.wishlist)
      }
      else {
        this.message = res.body.msg
      }
    }
  }

  wishlistArray() {
    for(var i=0; i<this.original_wishlist.length;i++) {
      var prod = {
        amount: this.original_wishlist[i].amount,
        id_product: this.original_wishlist[i].id_product,
        name: this.original_wishlist[i].name,
        url: `${this._baseUrl}${this.original_wishlist[i].url}`,
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


  async deleteProduct(id: number) {
    var res = await lastValueFrom(this._userService.removeProdWishlist(this._authService.getID(), id))
    if(res) {
      console.log(res)
      this.getWishlist()
    }
  }

  async modifyProduct(id: number, amount: number) {
    var res = await lastValueFrom(this._userService.editProdWishlist(this._authService.getID(), id, amount))
    if(res) {
      console.log(res)
      this.getWishlist()
    }
  }

}
