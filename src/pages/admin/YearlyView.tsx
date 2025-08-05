import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookOpen, TrendingUp } from 'lucide-react';

const YearlyView = () => {
  const currentYear = new Date().getFullYear();

  // Mock data for yearly statistics
  const yearlyStats = {
    totalBooksAdded: 52,
    monthlyAverage: 4.3,
    mostActiveMonth: 'March',
    categories: [
      { name: 'Poetry', added: 15, trend: '+12%' },
      { name: 'Reading', added: 18, trend: '+8%' },
      { name: 'Drama', added: 8, trend: '+5%' },
      { name: 'Tradition', added: 7, trend: '+3%' },
      { name: 'Folding', added: 4, trend: '+2%' },
    ]
  };

  const monthlyData = [
    { month: 'Jan', books: 3 },
    { month: 'Feb', books: 5 },
    { month: 'Mar', books: 8 },
    { month: 'Apr', books: 4 },
    { month: 'May', books: 6 },
    { month: 'Jun', books: 3 },
    { month: 'Jul', books: 2 },
    { month: 'Aug', books: 5 },
    { month: 'Sep', books: 4 },
    { month: 'Oct', books: 7 },
    { month: 'Nov', books: 3 },
    { month: 'Dec', books: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yearly View - {currentYear}</h1>
          <p className="text-muted-foreground">
            Annual overview of your digital library progress
          </p>
        </div>
      </div>

      {/* Yearly Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Added</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyStats.totalBooksAdded}</div>
            <p className="text-xs text-muted-foreground">
              Total for {currentYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyStats.monthlyAverage}</div>
            <p className="text-xs text-muted-foreground">
              Books per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyStats.mostActiveMonth}</div>
            <p className="text-xs text-muted-foreground">
              Peak month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">
              vs last year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>
            Books added each month in {currentYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-2">
            {monthlyData.map((data) => (
              <div key={data.month} className="text-center">
                <div 
                  className="bg-primary/20 rounded mb-2 flex items-end justify-center text-xs font-medium"
                  style={{ height: `${Math.max(data.books * 8, 16)}px` }}
                >
                  {data.books}
                </div>
                <div className="text-xs text-muted-foreground">{data.month}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>
            Books added by category this year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {yearlyStats.categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{category.added}</span>
                  <span className="text-sm text-green-600">{category.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyView;