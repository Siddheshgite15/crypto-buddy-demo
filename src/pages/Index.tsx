import { usePortfolio } from '@/hooks/usePortfolio';
import PortfolioHeader from '@/components/PortfolioHeader';
import PortfolioStats from '@/components/PortfolioStats';
import HoldingsList from '@/components/HoldingsList';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import SimulationControls from '@/components/SimulationControls';
import PortfolioChart from '@/components/PortfolioChart';
import { toast } from 'sonner';

const Index = () => {
  const { 
    coins, 
    portfolioData, 
    addTransaction, 
    updatePrices, 
    randomizePrices, 
    resetPrices 
  } = usePortfolio();

  const handleIncrease = () => {
    updatePrices(5);
    toast.success('Prices increased by 5%! 📈');
  };

  const handleDecrease = () => {
    updatePrices(-3);
    toast.info('Market dip: Prices decreased by 3% 📉');
  };

  const handleRandomize = () => {
    randomizePrices();
    toast('Prices randomized! 🎲');
  };

  const handleReset = () => {
    resetPrices();
    toast('Prices reset to original values');
  };

  return (
    <div className="min-h-screen bg-background">
      <PortfolioHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground">Track your crypto investments in real-time</p>
            </div>
            <AddTransactionDialog coins={coins} onAddTransaction={addTransaction} />
          </div>

          <PortfolioStats
            totalValue={portfolioData.totalValue}
            totalInvestment={portfolioData.totalInvestment}
            totalProfitLoss={portfolioData.totalProfitLoss}
            totalProfitLossPercentage={portfolioData.totalProfitLossPercentage}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <PortfolioChart currentValue={portfolioData.totalValue} />
              <HoldingsList holdings={portfolioData.holdings} />
            </div>
            
            <div>
              <SimulationControls
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRandomize={handleRandomize}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
