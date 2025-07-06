import { Transaction, MonthlyExpense, CategoryExpense, Budget, BudgetComparison, SpendingInsight, CATEGORY_COLORS } from './types';
export { generateId } from './storage';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthlyExpenses = (transactions: Transaction[]): MonthlyExpense[] => {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const monthlyData: { [key: string]: { amount: number; count: number } } = {};
  
  expenses.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { amount: 0, count: 0 };
    }
    
    monthlyData[monthKey].amount += transaction.amount;
    monthlyData[monthKey].count += 1;
  });
  
  return Object.entries(monthlyData)
    .map(([key, data]) => ({
      month: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-12);
};

export const getCategoryExpenses = (transactions: Transaction[]): CategoryExpense[] => {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categoryData: { [key: string]: { amount: number; count: number } } = {};
  
  expenses.forEach(transaction => {
    const category = transaction.category || 'Other';
    
    if (!categoryData[category]) {
      categoryData[category] = { amount: 0, count: 0 };
    }
    
    categoryData[category].amount += transaction.amount;
    categoryData[category].count += 1;
  });
  
  return Object.entries(categoryData)
    .map(([category, data], index) => ({
      category,
      amount: data.amount,
      count: data.count,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getBudgetComparisons = (transactions: Transaction[], budgets: Budget[], month: string): BudgetComparison[] => {
  const monthTransactions = transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
    return transactionMonth === month && t.type === 'expense';
  });

  const actualSpending: { [category: string]: number } = {};
  monthTransactions.forEach(t => {
    const category = t.category || 'Other';
    actualSpending[category] = (actualSpending[category] || 0) + t.amount;
  });

  const monthBudgets = budgets.filter(b => b.month === month);
  
  return monthBudgets.map((budget, index) => {
    const actual = actualSpending[budget.category] || 0;
    const remaining = budget.amount - actual;
    const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
    
    return {
      category: budget.category,
      budgeted: budget.amount,
      actual,
      remaining,
      percentage,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    };
  }).sort((a, b) => b.percentage - a.percentage);
};

export const getSpendingInsights = (transactions: Transaction[], budgets: Budget[]): SpendingInsight[] => {
  const insights: SpendingInsight[] = [];
  const currentMonth = getCurrentMonth();
  const budgetComparisons = getBudgetComparisons(transactions, budgets, currentMonth);
  
  // Budget warnings
  budgetComparisons.forEach(comparison => {
    if (comparison.percentage > 90) {
      insights.push({
        type: 'warning',
        title: `${comparison.category} Budget Alert`,
        description: `You've spent ${comparison.percentage.toFixed(0)}% of your ${comparison.category} budget this month.`,
        icon: 'AlertTriangle'
      });
    }
  });

  // Top spending category
  const categoryExpenses = getCategoryExpenses(transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
    return transactionMonth === currentMonth && t.type === 'expense';
  }));
  
  if (categoryExpenses.length > 0) {
    const topCategory = categoryExpenses[0];
    insights.push({
      type: 'info',
      title: 'Top Spending Category',
      description: `${topCategory.category} accounts for ${formatCurrency(topCategory.amount)} of your spending this month.`,
      icon: 'TrendingUp'
    });
  }

  // Savings opportunity
  const totalIncome = getTotalIncome(transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
    return transactionMonth === currentMonth;
  }));
  
  const totalExpenses = getTotalExpenses(transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
    return transactionMonth === currentMonth;
  }));

  if (totalIncome > 0 && totalExpenses > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    if (savingsRate > 20) {
      insights.push({
        type: 'success',
        title: 'Great Savings Rate!',
        description: `You're saving ${savingsRate.toFixed(0)}% of your income this month. Keep it up!`,
        icon: 'PiggyBank'
      });
    } else if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        description: `Consider reducing expenses to increase your savings rate from ${savingsRate.toFixed(0)}%.`,
        icon: 'Target'
      });
    }
  }

  return insights.slice(0, 3); // Limit to 3 insights
};

export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0);
};

export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0);
};

export const getBalance = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};