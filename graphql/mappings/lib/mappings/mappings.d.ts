import { EventContext, StoreContext } from '@subsquid/hydra-common';
export declare function balancesTransfer({ store, event, block, extrinsic, }: EventContext & StoreContext): Promise<void>;
export declare function entityStored({ store, event, block, extrinsic, }: EventContext & StoreContext): Promise<void>;
