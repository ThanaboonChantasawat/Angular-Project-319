import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth/auth.guard';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Set the login component as the default route
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  {
    path: 'products',
    component: ProductManagementComponent,
    canActivate: [authGuard],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
