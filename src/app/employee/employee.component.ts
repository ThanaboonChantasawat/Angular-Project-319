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
  employeeForm: FormGroup;
  employees: Employee[] = [];
  editIndex: number | null = null;
  editModal: bootstrap.Modal | null = null;
  searchTerm: string = '';
  sortField: keyof Employee = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      phone: ['', Validators.required],
      status: [true]
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
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe(employee => {
        this.employees.push(employee);
        this.employeeForm.reset();
      }, error => {
        console.error('Error adding employee:', error);
      });
    }
  }

  editEmployee(index: number): void {
    this.editIndex = index;
    const employee = this.employees[index];
    this.employeeForm.setValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      phone: employee.phone,
      status: employee.status
    });
    const modalElement = document.getElementById('editEmployeeModal');
    if (modalElement) {
      this.editModal = new bootstrap.Modal(modalElement);
      this.editModal.show();
    }
  }

  saveEdit(): void {
    if (this.employeeForm.valid && this.editIndex !== null) {
      const employee = this.employees[this.editIndex];
      this.employeeService.updateEmployee(employee._id!, this.employeeForm.value).subscribe(updatedEmployee => {
        this.employees[this.editIndex!] = updatedEmployee;
        this.editModal?.hide();
        this.editIndex = null;
      });
    }
  }

  confirmDelete(index: number): void {
    const employee = this.employees[index];
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${employee.firstName} ${employee.lastName}"?`)) {
      this.deleteEmployee(index);
    }
  }

  deleteEmployee(index: number): void {
    const employee = this.employees[index];
    this.employeeService.deleteEmployee(employee._id!).subscribe(() => {
      this.employees.splice(index, 1);
    });
  }

  toggleStatus(index: number): void {
    this.employees[index].status = !this.employees[index].status;
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