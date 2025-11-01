import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  name = '';
  message = '';

  // Inject AuthService and Router
  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.username, this.password, this.name)
      .subscribe({
        next: (res: { token: string; user: { username: string; name: string } }) => { 
          // Save token in localStorage
          localStorage.setItem('token', res.token);
          this.message = 'Registration successful!';

          // ----> Redirect to dashboard after successful registration
          this.router.navigate(['dashboard']); // <-- NEW
        },
        error: (err) => {
          this.message = err.error.message || 'Registration failed';
        }
      });
  }
}
