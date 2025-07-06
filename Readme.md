# Personal Finance Dashboard

A modern, responsive personal finance tracking application built with Next.js and React. Track your income, expenses, set budgets, and gain insights into your spending patterns with beautiful charts and analytics.


## ✨ Features

- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budget Planning**: Set monthly budgets for different categories and track your progress
- **Visual Analytics**: Beautiful charts showing spending patterns and budget comparisons
- **Spending Insights**: AI-powered insights and recommendations for better financial management
- **Category Organization**: Organize transactions by predefined categories
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: All data is stored locally in your browser for privacy
- **Export Ready**: Built with Next.js for easy deployment

## 🚀 Demo

[Live Demo](https://your-demo-link.vercel.app)


## 🛠️ Built With

- **Frontend Framework**: [Next.js 13](https://nextjs.org/)
- **UI Framework**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: For type safety and better development experience

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/satyam-singh3/Personal-Finance-Management-Tool.git
   cd personal-finance-dashboard
   ```

2. **Install dependencies**
   npm install


3. **Run the development server**
   ```bash
   npm run dev

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
personal-finance-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── BudgetComparison.tsx
│   ├── BudgetForm.tsx
│   ├── CategoryChart.tsx
│   ├── ExpenseChart.tsx
│   ├── SpendingInsights.tsx
│   ├── SummaryCards.tsx
│   ├── TransactionForm.tsx
│   └── TransactionList.tsx
├── lib/                   # Utility functions and types
│   ├── finance-utils.ts   # Financial calculations
│   ├── storage.ts         # Local storage utilities
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # General utilities
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```



**Made with ❤️ by [Satyam Singh](https://github.com/satyam-singh3)**