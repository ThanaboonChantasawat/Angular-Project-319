import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user-management/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-lg">
            <div class="card-header bg-primary text-white text-center py-3">
              <h3 class="mb-0">เพิ่มผู้ใช้</h3>
            </div>
            
            <div class="card-body p-4">
              <div *ngIf="error" class="alert alert-danger alert-dismissible fade show">
                {{error}}
                <button type="button" class="btn-close" (click)="error = ''"></button>
              </div>

              <div *ngIf="success" class="alert alert-success alert-dismissible fade show">
                {{success}}
                <button type="button" class="btn-close" (click)="success = ''"></button>
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">ชื่อผู้ใช้</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person"></i>
                    </span>
                    <input type="text" 
                           class="form-control" 
                           formControlName="username"
                           [class.is-invalid]="showError('username')"
                           placeholder="กรอกชื่อผู้ใช้">
                  </div>
                  <div class="invalid-feedback" *ngIf="showError('username')">
                    {{getErrorMessage('username')}}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">รหัสผ่าน</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input type="password" 
                           class="form-control"
                           formControlName="password"
                           [class.is-invalid]="showError('password')"
                           placeholder="กรอกรหัสผ่าน">
                  </div>
                  <div class="invalid-feedback" *ngIf="showError('password')">
                    {{getErrorMessage('password')}}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">ยืนยันรหัสผ่าน</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock-check"></i>
                    </span>
                    <input type="password" 
                           class="form-control"
                           formControlName="confirmPassword"
                           [class.is-invalid]="showError('confirmPassword')"
                           placeholder="ยืนยันรหัสผ่านอีกครั้ง">
                  </div>
                  <div class="invalid-feedback" *ngIf="showError('confirmPassword')">
                    {{getErrorMessage('confirmPassword')}}
                  </div>
                </div>

                <button type="submit" 
                        class="btn btn-primary w-100 py-2"
                        [disabled]="registerForm.invalid || isSubmitting">
                  <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{isSubmitting ? 'กำลังดำเนินการ...' : 'เพิ่มผู้ใช้'}}
                </button>
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
      border-radius: 10px;
    }
    .card-header {
      border-radius: 10px 10px 0 0;
    }
    .invalid-feedback {
      display: block;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  success = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  showError(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (!control?.errors) return '';

    if (control.errors['required']) return 'กรุณากรอกข้อมูล';
    if (control.errors['minlength']) return `ต้องมีอย่างน้อย ${control.errors['minlength'].requiredLength} ตัวอักษร`;
    if (control.errors['mismatch']) return 'รหัสผ่านไม่ตรงกัน';
    return '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.error = '';

      const { username, password } = this.registerForm.value;

      this.userService.register({ username, password }).subscribe({
        next: () => {
          this.success = 'ลงทะเบียนสำเร็จ';
          this.registerForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
          this.isSubmitting = false;
        }
      });
    }
  }
}
