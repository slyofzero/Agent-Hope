import { apiFetcher } from "@/utils/api";
import { errorHandler } from "@/utils/handlers";

export let ethPrice = 0;

interface BinancePriceRes {
  symbol: string;
  price: string;
}

export async function getEthPrice() {
  try {
    const data = await apiFetcher<BinancePriceRes>(
      "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
    );
    ethPrice = Number(data?.data.price);
  } catch (error) {
    errorHandler(error);
  }
}
