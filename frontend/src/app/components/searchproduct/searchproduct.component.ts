import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {CategoriesServerResponse, CategoryModelServer, ProductModelServer, ServerResponse} from '../../models/product.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-searchproduct',
  templateUrl: './searchproduct.component.html',
  styleUrl: './searchproduct.component.scss'
})
export class SearchproductComponent implements OnInit {
  title: string
  catId: number
  products: ProductModelServer[] = [];

  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title');
    this.catId = parseInt(this.route.snapshot.paramMap.get('catId')) ?? 0;
    console.log(this.title)
    console.log(this.catId);
    this.productService.searchProducts(this.title, this.catId).subscribe(results => {
      console.log(results)
      this.products = results.products;
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }

}
