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
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.title;
        })
      )
      .subscribe(title => {        
        this.title = title;
        this.productService.searchProducts(this.title, 0).subscribe(results => {
          console.log(results)
          this.products = results.products;
        });
        // this.productService.getAllProducts().subscribe((prods: ServerResponse) => {
        //   this.products = prods.products;
        // });
        
     });

    // this.productService.getAllProducts().subscribe((prods: ServerResponse) => {
    //   this.products = prods.products;
    // });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }

}
