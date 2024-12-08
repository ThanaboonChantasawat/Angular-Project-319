import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { EmployeeService } from '../services/employee.service';

interface Employee {
  _id?: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  status: boolean;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  addEmployeeForm: FormGroup;
  editEmployeeForm: FormGroup;
  employees: Employee[] = [];
  editModal: bootstrap.Modal | null = null;
  searchTerm: string = '';
  sortField: keyof Employee = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.addEmployeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.editEmployeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    }, error => {
      console.error('Error loading employees:', error);
    });
  }

  addEmployee(): void {
    if (this.addEmployeeForm.valid) {
      this.employeeService.addEmployee(this.addEmployeeForm.value).subscribe(employee => {
        this.employees.push(employee);
        this.addEmployeeForm.reset();
      }, error => {
        console.error('Error adding employee:', error);
      });
    }
  }

  editEmployee(employee: Employee): void {
    this.editEmployeeForm.setValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      phone: employee.phone
    });
    const modalElement = document.getElementById('editEmployeeModal');
    if (modalElement) {
      this.editModal = new bootstrap.Modal(modalElement);
      this.editModal.show();
    }
  }

  saveEdit(): void {
    if (this.editEmployeeForm.valid) {
      const updatedEmployee = { ...this.editEmployeeForm.value, _id: this.editEmployeeForm.value._id };
      this.employeeService.updateEmployee(updatedEmployee._id!, updatedEmployee).subscribe(() => {
        const index = this.employees.findIndex(emp => emp._id === updatedEmployee._id);
        if (index !== -1) {
          this.employees[index] = updatedEmployee;
        }
        this.editModal?.hide();
      });
    }
  }

  confirmDelete(employee: Employee): void {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${employee.firstName} ${employee.lastName}"?`)) {
      this.deleteEmployee(employee);
    }
  }

  deleteEmployee(employee: Employee): void {
    this.employeeService.deleteEmployee(employee._id!).subscribe(() => {
      this.employees = this.employees.filter(emp => emp._id !== employee._id);
    });
  }

  toggleStatus(employee: Employee): void {
    employee.status = !employee.status;
    this.employeeService.updateEmployee(employee._id!, employee).subscribe();
  }

  get sortedEmployees(): Employee[] {
    const filteredEmployees = this.filterEmployees(this.employees);
    return [...filteredEmployees].sort((a, b) => {
      const multiplier = this.sortDirection === 'asc' ? 1 : -1;
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return multiplier * aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return multiplier * (aValue === bValue ? 0 : aValue ? 1 : -1);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return multiplier * (aValue - bValue);
      } else {
        return 0;
      }
    });
  }

  filterEmployees(employees: Employee[]): Employee[] {
    return employees.filter(employee => {
      return !this.searchTerm || employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  sortEmployees(field: keyof Employee) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }
}