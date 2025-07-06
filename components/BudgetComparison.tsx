'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BudgetComparison } from '@/lib/types';
import { formatCurrency } from '@/lib/finance-utils';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetComparisonProps {
  data: BudgetComparison[];
  month: string;
}

export default function BudgetComparison({ data, month }: BudgetComparisonProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Budgeted: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-red-600">
            Actual: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-gray-500 text-sm">
            {payload[1].value > payload[0].value ? 'Over budget' : 'Under budget'}
          </p>
        </div>
      );
    }
    return null;
  };

  const monthName = new Date(month + '-01').toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Budget Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((budget) => (
          <Card key={budget.category} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{budget.category}</h3>
                {budget.percentage > 100 ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : budget.percentage > 90 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={Math.min(budget.percentage, 100)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{formatCurrency(budget.actual)}</span>
                  <span>{formatCurrency(budget.budgeted)}</span>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium ${
                    budget.percentage > 100 ? 'text-red-600' : 
                    budget.percentage > 90 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {budget.percentage.toFixed(0)}% used
                  </span>
                </div>
                {budget.remaining > 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    {formatCurrency(budget.remaining)} remaining
                  </p>
                )}
                {budget.remaining < 0 && (
                  <p className="text-xs text-red-500 text-center">
                    {formatCurrency(Math.abs(budget.remaining))} over budget
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget vs Actual Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget vs Actual - {monthName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No budget data available for this month. Set some budgets to track your spending!
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="budgeted" 
                    fill="#3B82F6"
                    name="Budgeted"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="actual" 
                    fill="#EF4444"
                    name="Actual"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}