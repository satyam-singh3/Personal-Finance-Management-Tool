import { Transaction, Budget } from './types';

const TRANSACTIONS_KEY = 'finance-transactions';
const BUDGETS_KEY = 'finance-budgets';

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
};

export const loadTransactions = (): Transaction[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const saveBudgets = (budgets: Budget[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  }
};

export const loadBudgets = (): Budget[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(BUDGETS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};