import { Transaction, Budget } from './types';

export function loadTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load transactions:', err);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (err) {
      console.error('Failed to save transactions:', err);
    }
  }
}

export function loadBudgets(): Budget[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('budgets');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load budgets:', err);
    return [];
  }
}

export function saveBudgets(budgets: Budget[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    } catch (err) {
      console.error('Failed to save budgets:', err);
    }
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
