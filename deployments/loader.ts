import { AiraMarketProtocolDeployment as mantleSepoliaDeployment } from './5003/AiraMarketProtocol';
import { AiraMarketProtocolDeployment as giwaDeployment } from './91342/AiraMarketProtocol';

const deployments: Record<number, Record<string, { address: string; abi: any }>> = {
  5003: {
    AiraMarketProtocol: mantleSepoliaDeployment,
    marketProtocol: mantleSepoliaDeployment
  },
  91342: {
    AiraMarketProtocol: giwaDeployment,
    marketProtocol: giwaDeployment
  }
};

export function getDeployment(chainId: number, contractName: string) {
  const chainDeployments = deployments[chainId];
  if (!chainDeployments) {
    return undefined;
  }
  return chainDeployments[contractName];
}
