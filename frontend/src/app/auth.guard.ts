import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    return true; // user is logged in, allow access
  } else {
    router.navigate(['']); // redirect to login
    return false; // block access
  }
};
