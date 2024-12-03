import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { 
    path: 'products', 
    component: ProductManagementComponent,
    canActivate: [authGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];