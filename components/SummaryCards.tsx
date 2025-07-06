'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/lib/types';
import { formatCurrency, getTotalExpenses, getTotalIncome, getBalance } from '@/lib/finance-utils';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const balance = getBalance(transactions);

  const cards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Current Balance',
      amount: balance,
      icon: balance >= 0 ? Wallet : DollarSign,
      color: balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.amount)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}