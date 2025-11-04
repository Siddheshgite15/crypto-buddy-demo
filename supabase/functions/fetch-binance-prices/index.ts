import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BinancePrice {
  symbol: string;
  price: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching prices from Binance API...");
    
    // Fetch prices for our tracked coins from Binance
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];
    const promises = symbols.map(symbol =>
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
        .then(res => res.json())
    );

    const responses = await Promise.all(promises);
    
    // Map Binance data to our format
    const coinMap: { [key: string]: string } = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'BNBUSDT': 'binance-coin',
      'ADAUSDT': 'cardano',
      'SOLUSDT': 'solana'
    };

    const prices = responses.map((data: any) => ({
      id: coinMap[data.symbol],
      currentPrice: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent)
    }));

    console.log("Successfully fetched prices:", prices);

    return new Response(
      JSON.stringify({ prices }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error fetching Binance prices:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
