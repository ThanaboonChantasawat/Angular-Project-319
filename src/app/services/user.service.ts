// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id?: string;
  username: string;
  password?: string; // Optional for updates
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/v1/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createAdmin(admin: Pick<User, 'username' | 'password'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin`, { ...admin, role: 'admin' }).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  updatePassword(id: string, password: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/password`, { password }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError(this.handleError)
    );
  }

  // Add registration method
  register(user: Pick<User, 'username' | 'password'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'));
  }
}