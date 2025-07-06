'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Budget } from '@/lib/types';
import { EXPENSE_CATEGORIES } from '@/lib/types';
import { generateId } from '@/lib/storage';
import { getCurrentMonth } from '@/lib/finance-utils';
import { Target, X } from 'lucide-react';

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (budget: Budget) => void;
  onCancel?: () => void;
  existingCategories?: string[];
}

export default function BudgetForm({ budget, onSubmit, onCancel, existingCategories = [] }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: getCurrentMonth(),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
        month: budget.month,
      });
    }
  }, [budget]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Please select a month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const now = new Date().toISOString();
      const budgetData: Budget = {
        id: budget?.id || generateId(),
        category: formData.category,
        amount: Number(formData.amount),
        month: formData.month,
        createdAt: budget?.createdAt || now,
        updatedAt: now,
      };

      await new Promise(resolve => setTimeout(resolve, 300));
      onSubmit(budgetData);
      
      if (!budget) {
        setFormData({
          category: '',
          amount: '',
          month: getCurrentMonth(),
        });
      }
    } catch (error) {
      console.error('Error submitting budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(cat => 
    !existingCategories.includes(cat) || cat === formData.category
  );

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = -2; i <= 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value: monthKey, label: monthLabel });
    }
    
    return options;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {budget ? 'Edit Budget' : 'Set Budget'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
              <SelectTrigger className={errors.month ? 'border-red-500' : ''}>
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
            {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : budget ? 'Update Budget' : 'Set Budget'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}