// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../product-management/product-management.component';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/v1/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  addProduct(product: Product): Observable<Product> {
    return this.http
      .post<Product>(this.apiUrl, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
