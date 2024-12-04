import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomPipe } from './custom.pipe';
import { AuthService } from './auth/auth.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomPipe
  ]
})
export class AppComponent {
  title = 'อารีญาคงคลัง';
  private logoutModal?: Modal;
  isMenuOpen = false;

  constructor(public authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openLogoutModal() {
    const modalEl = document.getElementById('logoutModal');
    if (modalEl) {
      this.logoutModal = new Modal(modalEl, {
        backdrop: 'static',
        keyboard: false
      });
      this.logoutModal.show();
    }
  }

  closeLogoutModal() {
    this.logoutModal?.hide();
  }

  confirmLogout() {
    this.authService.logout();
    this.closeLogoutModal();
  }

  ngOnDestroy() {
    this.logoutModal?.dispose();
  }
}