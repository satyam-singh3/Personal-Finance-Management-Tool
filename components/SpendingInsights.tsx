'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpendingInsight } from '@/lib/types';
import { AlertTriangle, TrendingUp, CheckCircle, Target, PiggyBank, Lightbulb } from 'lucide-react';

interface SpendingInsightsProps {
  insights: SpendingInsight[];
}

const iconMap = {
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Target,
  PiggyBank,
};

export default function SpendingInsights({ insights }: SpendingInsightsProps) {
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Add more transactions and set budgets to get personalized spending insights!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = iconMap[insight.icon as keyof typeof iconMap] || AlertTriangle;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'warning' 
                    ? 'bg-amber-50 border-amber-400' 
                    : insight.type === 'success'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className={`h-5 w-5 mt-0.5 ${
                    insight.type === 'warning' 
                      ? 'text-amber-600' 
                      : insight.type === 'success'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`} />
                  <div>
                    <h3 className={`font-medium ${
                      insight.type === 'warning' 
                        ? 'text-amber-800' 
                        : insight.type === 'success'
                        ? 'text-green-800'
                        : 'text-blue-800'
                    }`}>
                      {insight.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      insight.type === 'warning' 
                        ? 'text-amber-700' 
                        : insight.type === 'success'
                        ? 'text-green-700'
                        : 'text-blue-700'
                    }`}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}