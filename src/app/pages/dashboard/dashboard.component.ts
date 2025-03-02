import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalSpent = 5000;
  highestCategory = "Food & Drinks";

  constructor(private router: Router) {}

  addExpense() {
    this.router.navigate(['/add-expense']);
  }

  viewReports() {
    this.router.navigate(['/reports']);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
  }
