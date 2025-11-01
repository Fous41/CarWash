import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent {

  serviceName = '';
  date = '';
  time = '';
  message = '';

  constructor(private route: ActivatedRoute) {
    // Get service name from query params
    this.route.queryParams.subscribe(params => {
      this.serviceName = params['service'] || '';
    });
  }

  submitBooking() {
    this.message = `Booking confirmed for ${this.serviceName} on ${this.date} at ${this.time}`;
    // TODO: Send to backend later
  }
}
