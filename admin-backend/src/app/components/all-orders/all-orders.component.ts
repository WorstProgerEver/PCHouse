import { Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from '../../order.service';
import {Subscription} from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-all-orders',
  // standalone: true,
  // imports: [],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent {
  orders: any[] = [];
  subs: Subscription[] = [];
  errorMessage: string;
  hasError = false;
  success = false;

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.hasError = false;
    this.subs.push(this.orderService.getAllOrders().subscribe((os: any) => {
      this.orders = os.orders;
      console.log("orders:")
      console.log(this.orders);      
    }));
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  confirmOrder(orderId: number): void {
    this.subs.push(this.orderService.confirmOrder(orderId).subscribe(
      res => {
        if (res.status === 'failure') {
          this.hasError = true;
          this.errorMessage = res.message;
        }

        if (res.status === 'success') {
          this.success = true;
          this.errorMessage = res.message;
        }

        this.orders = res.orders;
        console.log(this.orders);
        $('.alert').delay(1000).slideUp(1500);
      }
    ));
  }
}
