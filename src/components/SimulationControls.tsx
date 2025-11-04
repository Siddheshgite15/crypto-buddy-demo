import { TrendingUp, TrendingDown, Shuffle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SimulationControlsProps {
  onIncrease: () => void;
  onDecrease: () => void;
  onRandomize: () => void;
  onReset: () => void;
}

const SimulationControls = ({ onIncrease, onDecrease, onRandomize, onReset }: SimulationControlsProps) => {
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Price Simulation</CardTitle>
          <Badge variant="secondary" className="gap-1">
            Demo Mode
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Test how your portfolio reacts to market changes with these simulation controls:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onIncrease} className="gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            +5% Bull Run
          </Button>
          <Button variant="outline" onClick={onDecrease} className="gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            -3% Dip
          </Button>
          <Button variant="outline" onClick={onRandomize} className="gap-2">
            <Shuffle className="h-4 w-4" />
            Randomize
          </Button>
          <Button variant="outline" onClick={onReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Prices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
