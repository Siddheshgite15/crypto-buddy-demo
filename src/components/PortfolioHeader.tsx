import { Wallet } from 'lucide-react';

const PortfolioHeader = () => {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">CryptoPilot</h1>
            <p className="text-sm text-muted-foreground">Your Beginner's Portfolio Tracker</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortfolioHeader;
