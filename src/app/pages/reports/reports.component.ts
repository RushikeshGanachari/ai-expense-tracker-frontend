import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AiService } from '../../services/ai.service';
import { ExpenseService } from '../../services/expense.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, MatCardModule, MatListModule, MatButtonModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements AfterViewInit {
  totalSpent: number = 0;
  expenses: any[] = [];
  loading: boolean = false;
  insights: string = '';
  formattedInsights: SafeHtml = '';

  @ViewChild('expenseChart') expenseChart!: ElementRef;

  constructor(
    private expenseService: ExpenseService,
    private aiService: AiService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExpenses();
  }

  ngAfterViewInit() {
    setTimeout(() => this.generateCharts(), 500);
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(data => {
      this.expenses = data;
      this.totalSpent = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      this.getAIInsights();
    });
  }

  generateCharts() {
    if (!this.expenseChart || !this.expenseChart.nativeElement) return;

    const categories = [...new Set(this.expenses.map(exp => exp.category))];
    const categoryTotals = categories.map(cat =>
      this.expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
    );

    new Chart(this.expenseChart.nativeElement, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{ data: categoryTotals, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  async getAIInsights() {
    try {
      this.loading = true;
      const spendingData = { expenses: this.expenses };
      const rawInsights = await this.aiService.generateSpendingInsights(spendingData);

      this.insights = rawInsights;
      this.formattedInsights = this.sanitizeMarkdown(rawInsights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      this.insights = "Could not generate insights.";
    } finally {
      this.loading = false;
    }
  }

  sanitizeMarkdown(markdown: string): SafeHtml {
    let html = markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
      .replace(/\n\s*\*\s(.*?)\n/g, '<ul><li>$1</li></ul>') 
      .replace(/\n/g, '<br>'); 

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
