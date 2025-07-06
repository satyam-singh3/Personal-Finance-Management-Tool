export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
  count: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  count: number;
  color: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
  createdAt: string;
  updatedAt: string;
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  remaining: number;
  percentage: number;
  color: string;
}

export interface FormErrors {
  amount?: string;
  date?: string;
  description?: string;
  category?: string;
}

export interface SpendingInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  icon: string;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Personal Care',
  'Home & Garden',
  'Gifts & Donations',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental Income',
  'Gifts',
  'Other'
];

export const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#F43F5E'  // Rose
];