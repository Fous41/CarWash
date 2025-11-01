import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.html',
  styleUrls: ['./services.css']
   
})
export class ServicesComponent {

  // Hardcoded services for now
  services = [
    { name: 'Basic Wash', price: 5 },
    { name: 'Full Wash', price: 10 },
    { name: 'Premium Wash', price: 20 }
  ];

  constructor(private router: Router) {}

  book(serviceName: string) {
    // Redirect to booking page with service name as query param
    this.router.navigate(['booking'], { queryParams: { service: serviceName } });
  }
}
