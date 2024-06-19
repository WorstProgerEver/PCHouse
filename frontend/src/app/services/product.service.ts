import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {CategoriesServerResponse, ProductModelServer, ServerResponse} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  /* This is to fetch all products from the backend server */
  getAllProducts(numberOfResults = 9) : Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString()
      }
    });
  }

  /* GET SINGLE PRODUCT FROM SERVER*/
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);
  }

  getAllCategories() : Observable<CategoriesServerResponse> {
    return this.http.get<CategoriesServerResponse>(this.SERVER_URL + '/categories', {
      // params: {
      //   limit: 9
      // }
    });
  }

  /* SEARCH PRODUCTS  */
  searchProducts(title: string, catId: number) : Observable<ServerResponse>  {
    // return this.http.get<ServerResponse>(this.SERVER_URL + '/products/search');
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products/search/' + title + '/' + catId);
    // return this.http.get<ServerResponse>(this.SERVER_URL + '/products/search/' + title + "/" + catId);
    // return this.http.get<ServerResponse>(this.SERVER_URL + '/products/search', {
    //   params: {
    //     title: title
    //   }
    // });
  }
}
