// src/app/services/erp-integration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErpIntegrationService {
  private erpApiUrl = 'http://central-erp-system/api';

  constructor(private http: HttpClient) { }

  syncProductData(product: any): Observable<any> {
    return this.http.post(`${this.erpApiUrl}/sync`, product);
  }
}