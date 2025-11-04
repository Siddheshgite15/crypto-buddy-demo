import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coin } from '@/types/portfolio';
import { toast } from 'sonner';

interface AddTransactionDialogProps {
  coins: Coin[];
  onAddTransaction: (transaction: {
    coinId: string;
    amount: number;
    price: number;
    date: string;
  }) => void;
}

const AddTransactionDialog = ({ coins, onAddTransaction }: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coinId || !amount || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(price);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    onAddTransaction({
      coinId,
      amount: amountNum,
      price: priceNum,
      date
    });

    toast.success('Transaction added successfully!');
    
    // Reset form
    setCoinId('');
    setAmount('');
    setPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a crypto purchase to track in your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coin">Cryptocurrency</Label>
            <Select value={coinId} onValueChange={setCoinId}>
              <SelectTrigger id="coin">
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {coins.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.image} {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Purchase Price (USD)</Label>
            <Input
              id="price"
              type="number"
              step="any"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
