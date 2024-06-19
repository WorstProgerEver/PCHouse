import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) {
  }

  getAllOrders(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:3000/api/orders');
  }

  confirmOrder(orderId): Observable<any> {
    return this.httpClient.post<{ message?: string, status: string }>(`http://localhost:3000/api/orders/confirm/${orderId}`, {
      orderId,
    }).pipe(
        switchMap(async (data) => {
          const orders = await this.getAllOrders().toPromise();
          return {
            ...data,
            ...orders
          };
        })
      );
  }

}
