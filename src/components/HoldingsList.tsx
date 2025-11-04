import { Holding } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HoldingsListProps {
  holdings: Holding[];
}

const HoldingsList = ({ holdings }: HoldingsListProps) => {
  if (holdings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No holdings yet. Add your first transaction to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {holdings.map((holding) => {
            const isProfit = holding.profitLoss >= 0;
            return (
              <div key={holding.coin.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    {holding.coin.image}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{holding.coin.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {holding.amount.toFixed(6)} {holding.coin.symbol}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ${holding.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {isProfit ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${isProfit ? 'text-success' : 'text-destructive'}`}>
                      {isProfit ? '+' : ''}{holding.profitLossPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HoldingsList;
