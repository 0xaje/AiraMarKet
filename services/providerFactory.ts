import { ethers } from 'ethers';
import { activeChainConfig } from '../config/chains';
import { Logger } from '../server/utils/logger';

export class ProviderFactory {
  private static providers: Map<string, ethers.JsonRpcProvider | ethers.WebSocketProvider> = new Map();

  /**
   * Get a cached or new JSON-RPC or WebSocket provider for the specified RPC URL or chain ID.
   * If no parameters are passed, it defaults to the RPC URL of the active chain configuration.
   */
  public static getProvider(
    rpcUrlOrChainId?: string | number,
    useWebsocket = false
  ): ethers.JsonRpcProvider | ethers.WebSocketProvider {
    let rpcUrl = activeChainConfig.rpcUrl;

    if (rpcUrlOrChainId) {
      if (typeof rpcUrlOrChainId === 'number') {
        if (rpcUrlOrChainId === activeChainConfig.chainId) {
          rpcUrl = activeChainConfig.rpcUrl;
        }
      } else {
        rpcUrl = rpcUrlOrChainId;
      }
    }

    const cacheKey = `${rpcUrl}_${useWebsocket ? 'ws' : 'rpc'}`;
    if (this.providers.has(cacheKey)) {
      return this.providers.get(cacheKey)!;
    }

    let provider: ethers.JsonRpcProvider | ethers.WebSocketProvider;

    if (useWebsocket) {
      const wsUrl = activeChainConfig.websocket || rpcUrl.replace(/^http/, 'ws');
      provider = new ethers.WebSocketProvider(wsUrl);
      Logger.info(`WebSocket Provider initialized for ${wsUrl}`);
    } else {
      provider = new ethers.JsonRpcProvider(rpcUrl);
      this.verifyProviderConnection(provider, rpcUrl);
    }

    this.providers.set(cacheKey, provider);
    return provider;
  }

  /**
   * Asynchronously validates RPC connection with retries, latency tracking, and structured logging.
   */
  private static async verifyProviderConnection(provider: ethers.JsonRpcProvider, rpcUrl: string, maxRetries = 3) {
    const startTime = Date.now();
    Logger.start(`Verifying RPC connectivity to ${rpcUrl}...`);

    let attempt = 0;
    while (attempt < maxRetries) {
      attempt++;
      try {
        const network = await provider.getNetwork();
        const latency = Date.now() - startTime;
        Logger.success(`Successfully connected to RPC ${rpcUrl}. Latency: ${latency}ms | Chain ID: ${network.chainId}`);
        return;
      } catch (e: any) {
        Logger.warn(`RPC connection attempt ${attempt}/${maxRetries} failed for ${rpcUrl}: ${e.message}`);
        if (attempt >= maxRetries) {
          Logger.error(`CRITICAL ERROR: Failed to establish RPC connection to ${rpcUrl} after ${maxRetries} attempts.`);
        } else {
          // Delay before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }
}
