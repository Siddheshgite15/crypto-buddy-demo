import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockHistoricalData } from '@/lib/mockData';
import { useMemo } from 'react';

interface PortfolioChartProps {
  currentValue: number;
}

const PortfolioChart = ({ currentValue }: PortfolioChartProps) => {
  const historicalData = useMemo(() => {
    const data = generateMockHistoricalData(30);
    // Update the last value to match current portfolio value
    if (data.length > 0 && currentValue > 0) {
      data[data.length - 1].value = Math.round(currentValue);
    }
    return data;
  }, [currentValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PortfolioChart;
