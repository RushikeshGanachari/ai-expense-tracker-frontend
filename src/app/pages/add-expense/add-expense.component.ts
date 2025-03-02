import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Expense } from '../../services/expense.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {
  expense: Partial<Expense> = {
    description: '',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0] // Ensure consistent date format
  };

  suggestedCategory: string = '';
  categories: string[] = ['Food & Drinks', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async onDescriptionChange() {
    if (this.expense.description && this.expense.description.length > 3) {
      this.suggestedCategory = await this.expenseService.categorizeExpense(this.expense.description);
      if (!this.expense.category) {
        this.expense.category = this.suggestedCategory;
      }
    }
  }

  saveExpense() {
    if (!this.expense.description || !this.expense.amount || !this.expense.category) {
      this.snackBar.open('Please fill all fields', 'Close', { duration: 3000 });
      return;
    }

    const formattedExpense: Expense = {
      description: this.expense.description,
      category: this.expense.category,
      amount: this.expense.amount,
      date: new Date(this.expense.date!).toISOString() // Ensure backend stores it correctly
    };

    this.expenseService.addExpense(formattedExpense).subscribe(() => {
      this.snackBar.open('Expense Added Successfully!', 'OK', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
