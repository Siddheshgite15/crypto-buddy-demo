import { useState, useEffect, useMemo } from 'react';
import { Transaction, Coin, PortfolioData, Holding } from '@/types/portfolio';
import { mockCoins } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';

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

    // Fetch real-time prices from Binance
    fetchBinancePrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(fetchBinancePrices, 30000);
    return () => clearInterval(interval);
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

  const fetchBinancePrices = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-binance-prices');
      
      if (error) {
        console.error('Error fetching Binance prices:', error);
        return;
      }

      if (data?.prices) {
        setCoins(prev => prev.map(coin => {
          const binancePrice = data.prices.find((p: any) => p.id === coin.id);
          if (binancePrice) {
            return {
              ...coin,
              currentPrice: binancePrice.currentPrice,
              change24h: binancePrice.change24h
            };
          }
          return coin;
        }));
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const updatePrices = (changePercent: number) => {
    setCoins(prev => prev.map(coin => ({
      ...coin,
      currentPrice: coin.currentPrice * (1 + changePercent / 100),
      change24h: changePercent
    })));
  };

  const resetPrices = () => {
    fetchBinancePrices();
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
      totalInvestment: totalCost,
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
    resetPrices,
    fetchBinancePrices
  };
};
