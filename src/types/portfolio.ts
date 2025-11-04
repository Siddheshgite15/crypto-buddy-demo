export interface Coin {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  image?: string;
}

export interface Transaction {
  id: string;
  coinId: string;
  amount: number;
  price: number;
  date: string;
}

export interface Holding {
  coin: Coin;
  amount: number;
  averagePrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface PortfolioData {
  totalValue: number;
  totalInvestment: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  holdings: Holding[];
}
