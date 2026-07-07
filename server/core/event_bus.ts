import { EventEmitter } from 'events';

// Central Event Bus for the AIRA Protocol
class AiraEventBus extends EventEmitter {}

export const eventBus = new AiraEventBus();

// Core Event Types
export enum SystemEvents {
    SIGNAL_RECEIVED = 'SIGNAL_RECEIVED',
    MARKET_PROPOSAL_GENERATED = 'MARKET_PROPOSAL_GENERATED',
    EVALUATION_SUBMITTED = 'EVALUATION_SUBMITTED',
    MARKET_APPROVED = 'MARKET_APPROVED',
    MARKET_SUGGESTED = 'MARKET_SUGGESTED',
    MARKET_RESOLVED = 'MARKET_RESOLVED'
}
