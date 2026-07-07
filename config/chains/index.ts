import { loadChainConfig } from './loader';
export * from './types';
export const activeChainConfig = loadChainConfig();
