import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Employee {
  _id?: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5000/api/v1/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}