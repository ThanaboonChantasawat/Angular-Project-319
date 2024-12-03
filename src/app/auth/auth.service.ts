// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(username: string, password: string): boolean {
    // Demo login - ในงานจริงควรต่อกับ API
    if (username === 'admin' && password === 'admin123') {
      this.isAuthenticatedSubject.next(true);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}