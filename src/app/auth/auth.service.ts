// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Logic to authenticate user
    // If successful:
    this.loggedIn = true;
    return true;
    // Else:
    // return false;
  }

  logout() {
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}