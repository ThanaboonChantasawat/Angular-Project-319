// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">เข้าสู่ระบบ</h2>
              
              <div class="alert alert-danger" *ngIf="error">
                {{ error }}
              </div>

              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">ชื่อผู้ใช้</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username"
                    [(ngModel)]="username"
                    name="username"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">รหัสผ่าน</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    [(ngModel)]="password"
                    name="password"
                    required
                  >
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-box-arrow-in-right me-2"></i>เข้าสู่ระบบ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/products']);
    } else {
      this.error = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    }
  }
}