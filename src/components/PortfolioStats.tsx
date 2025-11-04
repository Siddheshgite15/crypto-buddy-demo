import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PortfolioStatsProps {
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}

const PortfolioStats = ({ totalValue, totalProfitLoss, totalProfitLossPercentage }: PortfolioStatsProps) => {
  const isProfit = totalProfitLoss >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Total Portfolio Value</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium">Total Profit/Loss</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
              {isProfit ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className={`text-lg font-semibold ${isProfit ? 'text-success' : 'text-destructive'}`}>
              ({isProfit ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioStats;
