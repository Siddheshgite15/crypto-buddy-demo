import { useState, useEffect, useMemo } from 'react';
import { Transaction, Coin, PortfolioData, Holding } from '@/types/portfolio';
import { mockCoins } from '@/lib/mockData';

const STORAGE_KEY = 'cryptopilot-transactions';
const PRICES_KEY = 'cryptopilot-prices';

export const usePortfolio = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [coins, setCoins] = useState<Coin[]>(mockCoins);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);
    const savedPrices = localStorage.getItem(PRICES_KEY);
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedPrices) {
      setCoins(JSON.parse(savedPrices));
    }
  }, []);

  // Save to localStorage when transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Save to localStorage when prices change
  useEffect(() => {
    localStorage.setItem(PRICES_KEY, JSON.stringify(coins));
  }, [coins]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updatePrices = (changePercent: number) => {
    setCoins(prev => prev.map(coin => ({
      ...coin,
      currentPrice: coin.currentPrice * (1 + changePercent / 100),
      change24h: changePercent
    })));
  };

  const randomizePrices = () => {
    setCoins(prev => prev.map(coin => {
      const change = (Math.random() - 0.5) * 10; // -5% to +5%
      return {
        ...coin,
        currentPrice: coin.currentPrice * (1 + change / 100),
        change24h: change
      };
    }));
  };

  const resetPrices = () => {
    setCoins(mockCoins);
  };

  const portfolioData: PortfolioData = useMemo(() => {
    // Group transactions by coin
    const holdingsMap = new Map<string, { amount: number; totalCost: number }>();

    transactions.forEach(tx => {
      const existing = holdingsMap.get(tx.coinId) || { amount: 0, totalCost: 0 };
      holdingsMap.set(tx.coinId, {
        amount: existing.amount + tx.amount,
        totalCost: existing.totalCost + (tx.amount * tx.price)
      });
    });

    // Calculate holdings
    const holdings: Holding[] = Array.from(holdingsMap.entries())
      .map(([coinId, { amount, totalCost }]) => {
        const coin = coins.find(c => c.id === coinId);
        if (!coin || amount === 0) return null;

        const averagePrice = totalCost / amount;
        const currentValue = amount * coin.currentPrice;
        const profitLoss = currentValue - totalCost;
        const profitLossPercentage = (profitLoss / totalCost) * 100;

        return {
          coin,
          amount,
          averagePrice,
          currentValue,
          profitLoss,
          profitLossPercentage
        };
      })
      .filter((h): h is Holding => h !== null);

    // Calculate totals
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalCost = holdings.reduce((sum, h) => sum + (h.amount * h.averagePrice), 0);
    const totalProfitLoss = totalValue - totalCost;
    const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    return {
      totalValue,
      totalProfitLoss,
      totalProfitLossPercentage,
      holdings
    };
  }, [transactions, coins]);

  return {
    transactions,
    coins,
    portfolioData,
    addTransaction,
    deleteTransaction,
    updatePrices,
    randomizePrices,
    resetPrices
  };
};
