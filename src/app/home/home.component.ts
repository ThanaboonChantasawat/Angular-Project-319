import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private navbarCollapse?: bootstrap.Collapse;

  ngOnInit() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarContent = document.querySelector('#navbarNav');
    
    if (navbarToggler && navbarContent) {
      navbarToggler.addEventListener('click', () => {
        this.navbarCollapse = new bootstrap.Collapse(navbarContent);
      });
    }
  }

  ngOnDestroy() {
    this.navbarCollapse?.dispose();
  }
}