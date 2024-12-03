import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomPipe } from './custom.pipe';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CustomPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ระบบจัดการสินค้า';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  openLogoutModal() {
    const modalElement = document.getElementById('logoutModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeLogoutModal() {
    const modalElement = document.getElementById('logoutModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  confirmLogout() {
    this.closeLogoutModal();
    this.logout();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}