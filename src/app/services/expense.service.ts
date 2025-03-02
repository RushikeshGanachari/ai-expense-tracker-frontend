import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AiService } from './ai.service'; // AI categorization service
import { map } from 'rxjs/operators';

export interface Expense {
  _id?: string;
  description: string;
  category: string;
  amount: number;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private API_URL = 'http://localhost:5000/api/expenses';
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(private http: HttpClient, private aiService: AiService) {
    this.loadExpenses();
  }

  // ✅ Load Expenses from Backend
  private loadExpenses(): void {
    this.http.get<{ success: boolean; expenses: Expense[] }>(this.API_URL, { withCredentials: true })
      .subscribe(response => {
        if (response.success) {
          this.expensesSubject.next(response.expenses);
        }
      });
  }

  // ✅ Categorize Expense using AI
  async categorizeExpense(description: string): Promise<string> {
    return this.aiService.categorizeExpense(description);
  }

  // ✅ Add Expense to Backend
  addExpense(expense: Expense): Observable<void> {
    return this.http.post<{ success: boolean; expense: Expense }>(this.API_URL, expense, { withCredentials: true })
      .pipe(
        map(response => {
          if (response.success) {
            this.expensesSubject.next([...this.expensesSubject.value, response.expense]);
          }
        })
      );
  }

  // ✅ Get Expenses from Backend
  getExpenses(): Observable<Expense[]> {
    return this.expenses$;
  }

  // ✅ Delete Expense from Backend
  deleteExpense(expenseId: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.API_URL}/${expenseId}`, { withCredentials: true })
      .pipe(
        map(response => {
          if (response.success) {
            this.expensesSubject.next(this.expensesSubject.value.filter(exp => exp._id !== expenseId));
          }
        })
      );
  }

  // ✅ Get Spending Insights (AI)
  getSpendingInsights(): Promise<string> {
    return this.aiService.generateSpendingInsights(this.expensesSubject.value);
  }
}
