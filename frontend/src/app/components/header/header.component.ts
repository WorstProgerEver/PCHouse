import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {UserService} from '../../services/user.service';
import {ProductService} from '../../services/product.service';
import {CategoriesServerResponse, CategoryModelServer, ProductModelServer, ServerResponse} from '../../models/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  authState: boolean;

  categories: CategoryModelServer[] = [];

  constructor(private productService: ProductService,
              public cartService: CartService,
              public userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.userService.authState$.subscribe(authState => this.authState = authState);

    this.productService.getAllCategories().subscribe((cats: CategoriesServerResponse) => {
      this.categories = cats.categories;
    });
  }

}
