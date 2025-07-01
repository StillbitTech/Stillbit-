import { getBestSwapRoute } from "@/integrations/jupiter"

interface SwapRouteInfo {
  fromMint: string
  toMint: string
  amountIn: number
  estimatedOut: number
  routePath: string[]
  slippage: number
}

export async function getOptimalSwap(
  fromMint: string,
  toMint: string,
  amount: number
): Promise<SwapRouteInfo | null> {
  const route = await getBestSwapRoute(fromMint, toMint, amount)
  if (!route) return null

  return {
    fromMint,
    toMint,
    amountIn: amount,
    estimatedOut: route.outAmount,
    routePath: route.path,
    slippage: route.slippage
  }
}
