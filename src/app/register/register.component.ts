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
          <div class="card shadow">
            <div class="card-body">
              <h3 class="text-center mb-4">สมัครสมาชิก</h3>
              
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
                  <input type="text" class="form-control" formControlName="username">
                  <div class="text-danger" *ngIf="showError('username')">
                    {{getErrorMessage('username')}}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">รหัสผ่าน</label>
                  <input type="password" class="form-control" formControlName="password">
                  <div class="text-danger" *ngIf="showError('password')">
                    {{getErrorMessage('password')}}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">ยืนยันรหัสผ่าน</label>
                  <input type="password" class="form-control" formControlName="confirmPassword">
                  <div class="text-danger" *ngIf="showError('confirmPassword')">
                    {{getErrorMessage('confirmPassword')}}
                  </div>
                </div>

                <button type="submit" 
                        class="btn btn-primary w-100" 
                        [disabled]="registerForm.invalid || isSubmitting">
                  {{isSubmitting ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
      this.success = '';

      const { username, password } = this.registerForm.value;

      this.userService.register({ username, password }).subscribe({
        next: () => {
          this.success = 'ลงทะเบียนสำเร็จ';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          if (err.error?.message === 'ชื่อผู้ใช้นี้มีอยู่แล้ว') {
            this.error = 'ชื่อผู้ใช้นี้มีในระบบแล้ว กรุณาเลือกชื่อผู้ใช้อื่น';
          } else {
            this.error = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
          }
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
