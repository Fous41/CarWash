import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // <-- IMPORT Router

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {

  ngOnInit() {
    console.log("DEBUGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
  }

  username = '';
  password = '';
  message = '';

  // <-- Inject Router in constructor
  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // Save token in localStorage
        localStorage.setItem('token', res.token);
        this.message = 'Login successful!';

        // ----> Redirect to Booking page after successful login
        this.router.navigate(['booking']); // change 'dashboard' to 'booking' or your page
      },
      error: (err) => {
        this.message = err.error.message || 'Login failed';
      }
    });
  }

  // ----> NEW: Navigate to Register page
  goToRegister() {
    this.router.navigate(['register']);
  }
}
