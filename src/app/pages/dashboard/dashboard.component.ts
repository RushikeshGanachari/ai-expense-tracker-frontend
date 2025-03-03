import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ExpenseService } from '../../services/expense.service';
import { AgChartsModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';

import { AgCharts } from "ag-charts-angular";




@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule, AgChartsModule, AgCharts],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalSpent = 0;
  highestCategory = '';
  expenses: any[] = [];
  isLoading = true;

  public chartOptions!: AgChartOptions;

  



  constructor(private router: Router, private expenseService: ExpenseService) {
    this.chartOptions = {
      title: {
        text: "Monthly Spending Trends",
      },
      data: [],
      series: [
        {
          type: "line",
          xKey: "date",  // x-axis: Date
          yKey: "amount", // y-axis: Expense Amount
          yName: "Expenses",
          stroke: "#0288D1",
          marker: {
            size: 5,
            fill: "#0288D1",
            stroke: "#0288D1",
          },
        },
      ],
    };
  
  }

  ngOnInit() {
    this.fetchExpenses();
  }

  fetchExpenses() {
    this.expenseService.getExpenses().subscribe({
      next: (data:any) => {
        this.expenses = data;
      this.totalSpent = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        // Find highest spending category
    const categoryTotals: Record<string, number> = {};
    this.expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    this.highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b, '');

      // Prepare chart data after expenses are fetched
      this.prepareChartData();

        this.isLoading = false;
      },
      error: (error:any) => {
        console.error('Error fetching expenses:', error);
        this.isLoading = false;
      }
    });
  }

  // prepareChartData() {
  //   const groupedByDate: Record<string, number> = {};

  //   this.expenses.forEach((exp) => {
  //     const date = new Date(exp.date).toISOString().split('T')[0];
  //     groupedByDate[date] = (groupedByDate[date] || 0) + exp.amount;
  //   });

  //   this.chartOptions = {
  //     ...this.chartOptions,
  //     data: Object.keys(groupedByDate).map(date => ({
  //       date,
  //       amount: groupedByDate[date]
  //     }))
  //   };
  // } 

  prepareChartData() {
    if (!this.expenses || this.expenses.length === 0) return;
  
    const groupedByDate: Record<string, number> = {};
  
    this.expenses.forEach((exp) => {
      const date = new Date(exp.date).toISOString().split("T")[0];
      groupedByDate[date] = (groupedByDate[date] || 0) + exp.amount;
    });
  
    // Update chartOptions with API data
    this.chartOptions = {
      ...this.chartOptions, // Preserve existing settings
      data: Object.keys(groupedByDate).map(date => ({
        date,
        amount: groupedByDate[date]
      }))
    };
  }
  

  calculateSummary() {
    this.totalSpent = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Find highest spending category
    const categoryTotals: Record<string, number> = {};
    this.expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    this.highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b, '');
  }

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
