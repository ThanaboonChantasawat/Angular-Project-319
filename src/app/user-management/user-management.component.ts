import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User } from './user.service';
declare var bootstrap: any; // For Bootstrap modal typing

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  passwordForm: FormGroup;
  editingUser: User | null = null;
  private editModal: any;
  private passwordModal: any;

  showAlert = false;
  alertMessage = '';
  alertType = 'success';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    // Separate forms for editing and password change
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      role: ['user', Validators.required]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.initializeModals();
  }

  private initializeModals(): void {
    const editModalEl = document.getElementById('editUserModal');
    const passwordModalEl = document.getElementById('changePasswordModal');

    if (editModalEl) {
      this.editModal = new bootstrap.Modal(editModalEl);
      editModalEl.addEventListener('hidden.bs.modal', () => {
        this.editingUser = null;
        this.userForm.reset({ role: 'user' });
      });
    }

    if (passwordModalEl) {
      this.passwordModal = new bootstrap.Modal(passwordModalEl);
      passwordModalEl.addEventListener('hidden.bs.modal', () => {
        this.editingUser = null;
        this.passwordForm.reset();
      });
    }
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  editUser(user: User): void {
    if (!this.editModal) {
      console.error('Edit modal not initialized');
      return;
    }
    
    this.editingUser = user;
    this.userForm.patchValue({
      username: user.username,
      role: user.role
    });
    this.editModal.show();
  }

  changePassword(user: User): void {
    if (!this.passwordModal) {
      console.error('Password modal not initialized');
      return;
    }

    this.editingUser = user;
    this.passwordForm.reset(); // Clear previous password
    this.passwordModal.show();
  }

  deleteUser(user: User): void {
    if (!user.id) {
      console.error('Cannot delete user: Missing ID');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }

  saveUser(): void {
    if (this.userForm.valid && this.editingUser?.id) {
      const updatedUser = {
        id: this.editingUser.id,
        username: this.userForm.value.username,
        role: this.userForm.value.role
      };

      this.userService.updateUser(this.editingUser.id, updatedUser).subscribe({
        next: (user) => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = user;
          }
          this.editModal.hide();
          this.showNotification('อัพเดทผู้ใช้สำเร็จ', 'success');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.showNotification('เกิดข้อผิดพลาดในการอัพเดท', 'danger');
        }
      });
    }
  }

  savePassword(): void {
    if (this.passwordForm.valid && this.editingUser?.id) {
      this.userService.updatePassword(
        this.editingUser.id,
        this.passwordForm.value.password
      ).subscribe({
        next: () => {
          this.passwordModal.hide();
          this.showNotification('เปลี่ยนรหัสผ่านสำเร็จ', 'success');
        },
        error: (error) => {
          console.error('Error updating password:', error);
          this.showNotification('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', 'danger');
        }
      });
    }
  }

  private showNotification(message: string, type: 'success' | 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3000);
  }

  // Validation helpers
  getFieldError(form: FormGroup, fieldName: string): string {
    const control = form.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'กรุณากรอกข้อมูล';
      if (control.errors['minlength']) return `ต้องมีอย่างน้อย ${control.errors['minlength'].requiredLength} ตัวอักษร`;
    }
    return '';
  }
}
