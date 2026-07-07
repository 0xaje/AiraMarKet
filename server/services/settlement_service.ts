import { ethers } from 'ethers';
import { ProviderFactory } from '../../services/providerFactory';
import { ContractFactory } from '../../services/contractFactory';
import { activeChainConfig } from '../../config/chains';
import { Logger } from '../utils/logger';

/**
 * Multi-chain Settlement & Oracle Service
 * Handles verifiable resolutions of prediction markets
 */
export class SettlementService {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contractAddress: string;

    constructor() {
        // Obtain provider from ProviderFactory
        this.provider = ProviderFactory.getProvider() as ethers.JsonRpcProvider;
        
        const pk = process.env.PRIVATE_KEY;
        if (!pk) {
             Logger.error("[SETTLEMENT_SERVICE] FATAL CONFIG ERROR: PRIVATE_KEY environment variable is missing.");
             process.exit(1);
        }
        this.wallet = new ethers.Wallet(pk, this.provider);
        this.contractAddress = activeChainConfig.contracts.marketProtocol;
        if (!this.contractAddress) {
            Logger.warn("[SETTLEMENT_SERVICE] Contract address is not set in active configuration. Oracle resolution will fail.");
        }
    }

    listenToEvents() {
        Logger.info(`[SETTLEMENT_SERVICE] Subscribing to contract events at address ${this.contractAddress}`);
        
        // Instantiate using ContractFactory
        const marketContract = ContractFactory.getContract('AiraMarketProtocol', this.provider);
        
        marketContract.on("MarketCreated", (id, title, category, expiry, creator) => {
            Logger.info(`[ON-CHAIN EVENT] New Market Created: ${title} (ID: ${id}) by ${creator}`);
        });

        marketContract.on("MarketResolved", (marketId, outcome, resolver) => {
            Logger.info(`[ON-CHAIN EVENT] Market ${marketId} Resolved as ${outcome ? 'YES' : 'NO'} by ${resolver}`);
        });
    }

    async resolveMarket(marketId: number, outcome: boolean) {
        Logger.start(`[SETTLEMENT_ORACLE] Initiating market resolution transaction for market ${marketId} with outcome: ${outcome ? 'YES' : 'NO'}`);
        
        try {
            // Instantiate with wallet/signer using ContractFactory
            const marketContract = ContractFactory.getContract('AiraMarketProtocol', this.wallet);
            
            // Execute real on-chain transaction
            const tx = await marketContract.resolveMarket(marketId, outcome);
            Logger.success(`[SETTLEMENT_ORACLE] Transaction submitted successfully. Hash: ${tx.hash}`);
            
            await tx.wait();
            Logger.success(`[SETTLEMENT_ORACLE] On-chain Resolution Confirmed for Market ID: ${marketId}`);
            
            return { success: true, txHash: tx.hash };
        } catch (error: any) {
            Logger.error(`[SETTLEMENT_ORACLE] On-chain Resolution Failed`, error);
            return { success: false, error: error.message };
        }
    }
}

export const settlementService = new SettlementService();
export default settlementService;
