import { ethers } from 'ethers';
import { activeChainConfig } from '../config/chains';
import { getDeployment } from '../deployments/loader';
import { ProviderFactory } from './providerFactory';
import { Logger } from '../server/utils/logger';

export class ContractFactory {
  /**
   * Get an instance of a contract.
   * If a runner (provider, signer, wallet) is not provided, it defaults to the active provider from ProviderFactory.
   */
  public static getContract(
    contractName: string,
    runner?: ethers.ContractRunner,
    overrideAddress?: string
  ): ethers.Contract {
    const chainId = activeChainConfig.chainId;
    const deployment = getDeployment(chainId, contractName);

    if (!deployment) {
      const errorMsg = `[ContractFactory] Deployment configuration not found for contract "${contractName}" on chain ID ${chainId}.`;
      Logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!deployment.abi || !Array.isArray(deployment.abi) || deployment.abi.length === 0) {
      const errorMsg = `[ContractFactory] Deployment ABI is missing, malformed, or empty for contract "${contractName}" on chain ID ${chainId}.`;
      Logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    let address = overrideAddress;
    if (!address) {
      address = deployment.address;
    }
    if (!address) {
      address = activeChainConfig.contracts[contractName] || activeChainConfig.contracts['marketProtocol'];
    }

    if (!address) {
      const errorMsg = `[ContractFactory] No contract address resolved for "${contractName}" on chain ID ${chainId}.`;
      Logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!ethers.isAddress(address)) {
      const errorMsg = `[ContractFactory] Resolved address "${address}" for contract "${contractName}" is not a valid EVM address format.`;
      Logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const finalRunner = runner || ProviderFactory.getProvider();
    
    Logger.info(`Instantiated Contract instance: "${contractName}" at address ${address} on chain ${chainId}`);
    return new ethers.Contract(address, deployment.abi, finalRunner);
  }
}
