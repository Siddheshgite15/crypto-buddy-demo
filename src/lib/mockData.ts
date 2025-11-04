import { Coin } from '@/types/portfolio';

export const mockCoins: Coin[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    currentPrice: 45000,
    change24h: 2.5,
    image: '₿'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    currentPrice: 2800,
    change24h: 3.2,
    image: 'Ξ'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    currentPrice: 0.45,
    change24h: -1.2,
    image: '₳'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    currentPrice: 98.50,
    change24h: 5.7,
    image: '◎'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    currentPrice: 6.85,
    change24h: -0.8,
    image: '●'
  }
];

export const generateMockHistoricalData = (days: number = 30) => {
  const data = [];
  const baseValue = 10000;
  let currentValue = baseValue;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.45) * 500;
    currentValue = Math.max(currentValue + change, baseValue * 0.7);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(currentValue)
    });
  }
  
  return data;
};
