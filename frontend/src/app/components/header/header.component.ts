import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {UserService} from '../../services/user.service';
import {ProductService} from '../../services/product.service';
import {CategoriesServerResponse, CategoryModelServer, ProductModelServer, ServerResponse} from '../../models/product.model';
import {EmailValidator, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup
  cartData: CartModelServer;
  cartTotal: number;
  authState: boolean;

  categories: CategoryModelServer[] = [];

  constructor(private productService: ProductService,
              public cartService: CartService,
              public userService: UserService,
              private fb: FormBuilder
  ) {
    
    this.searchForm = fb.group({
      catId: ['0'],
      title: ['']
    });
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.userService.authState$.subscribe(authState => this.authState = authState);

    this.productService.getAllCategories().subscribe((cats: CategoriesServerResponse) => {
      this.categories = cats.categories;
    });
  }

  searchUpProducts() {
    if (this.searchForm.invalid) {
      return;
    }

    console.log(this.searchForm.value)
    window.location.href = window.location.origin + '/searchproduct/' +  this.searchForm.value.title + '/' + this.searchForm.value.catId
  }

}
