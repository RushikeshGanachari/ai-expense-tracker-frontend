import { Routes } from '@angular/router';
import { AddExpenseComponent } from './pages/add-expense/add-expense.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default Route
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'add-expense', component: AddExpenseComponent }, 
  { path: 'reports', component: ReportsComponent }, 
];
