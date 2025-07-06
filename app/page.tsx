'use client';

import { useState, useEffect } from 'react';
import { Transaction, Budget } from '@/lib/types';
import { loadTransactions, saveTransactions, loadBudgets, saveBudgets } from '@/lib/storage';
import { 
  getMonthlyExpenses, 
  getCategoryExpenses, 
  getBudgetComparisons, 
  getSpendingInsights,
  getCurrentMonth 
} from '@/lib/finance-utils';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';
import CategoryChart from '@/components/CategoryChart';
import SummaryCards from '@/components/SummaryCards';
import BudgetForm from '@/components/BudgetForm';
import BudgetComparison from '@/components/BudgetComparison';
import SpendingInsights from '@/components/SpendingInsights';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, BarChart3, Target, TrendingUp, Settings } from 'lucide-react';

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTransactions = loadTransactions();
    const loadedBudgets = loadBudgets();
    setTransactions(loadedTransactions);
    setBudgets(loadedBudgets);
    setIsLoading(false);
  }, []);

  const handleAddTransaction = (transaction: Transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    setShowTransactionForm(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id ? transaction : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleAddBudget = (budget: Budget) => {
    const updatedBudgets = [...budgets, budget];
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    setShowBudgetForm(false);
  };

  const handleEditBudget = (budget: Budget) => {
    const updatedBudgets = budgets.map(b => 
      b.id === budget.id ? budget : b
    );
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter(b => b.id !== id);
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
  };

  const monthlyExpenses = getMonthlyExpenses(transactions);
  const categoryExpenses = getCategoryExpenses(transactions);
  const budgetComparisons = getBudgetComparisons(transactions, budgets, selectedMonth);
  const spendingInsights = getSpendingInsights(transactions, budgets);

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value: monthKey, label: monthLabel });
    }
    
    return options;
  };

  const existingBudgetCategories = budgets
    .filter(b => b.month === selectedMonth)
    .map(b => b.category);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Personal Finance Dashboard
            </h1>
            <p className="text-gray-600">
              Track expenses, manage budgets, and gain insights into your spending
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8">
            <SummaryCards transactions={transactions} />
          </div>

          {/* Action Buttons */}
          {!showTransactionForm && !editingTransaction && !showBudgetForm && !editingBudget && (
            <div className="mb-8 flex justify-center gap-4">
              <Button
                onClick={() => setShowTransactionForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Transaction
              </Button>
              <Button
                onClick={() => setShowBudgetForm(true)}
                variant="outline"
                className="px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Target className="h-5 w-5 mr-2" />
                Set Budget
              </Button>
            </div>
          )}

          {/* Forms */}
          {(showTransactionForm || editingTransaction) && (
            <div className="mb-8">
              <TransactionForm
                transaction={editingTransaction || undefined}
                onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                onCancel={() => {
                  setShowTransactionForm(false);
                  setEditingTransaction(null);
                }}
              />
            </div>
          )}

          {(showBudgetForm || editingBudget) && (
            <div className="mb-8">
              <BudgetForm
                budget={editingBudget || undefined}
                onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
                onCancel={() => {
                  setShowBudgetForm(false);
                  setEditingBudget(null);
                }}
                existingCategories={existingBudgetCategories}
              />
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="budgets" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Budgets
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseChart data={monthlyExpenses} />
                <CategoryChart data={categoryExpenses} />
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <TransactionList
                transactions={transactions}
                onEdit={setEditingTransaction}
                onDelete={handleDeleteTransaction}
              />
            </TabsContent>

            <TabsContent value="budgets" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Budget Management</h2>
                <div className="flex items-center gap-4">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateMonthOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <BudgetComparison data={budgetComparisons} month={selectedMonth} />
              
              {budgetComparisons.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {budgetComparisons.map((budget) => (
                    <Card key={budget.category} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{budget.category}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const budgetToEdit = budgets.find(b => 
                                b.category === budget.category && b.month === selectedMonth
                              );
                              if (budgetToEdit) setEditingBudget(budgetToEdit);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          Budget: {budget.budgeted.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Spent: {budget.actual.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <SpendingInsights insights={spendingInsights} />
            </TabsContent>
          </Tabs>

          {/* Welcome Message for New Users */}
          {transactions.length === 0 && !showTransactionForm && (
            <Card className="mt-8 border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Welcome to Your Finance Dashboard!
                </h3>
                <p className="text-gray-500 mb-6">
                  Start by adding your first transaction to begin tracking your financial journey.
                </p>
                <Button
                  onClick={() => setShowTransactionForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}