// Tranfer and BlockTimestamp are not in schema - but you 
import { Transfer, BlockTimestamp } from 'query-node'

// run 'NODE_URL=<RPC_ENDPOINT> EVENTS=<comma separated list of events> yarn codegen:mappings-types'
// to genenerate typescript classes for events, such as Balances.TransferEvent
import { Balances, Timestamp } from './generated/types'
import BN from 'bn.js'
import {
  ExtrinsicContext,
  EventContext,
  StoreContext,
} from '@subsquid/hydra-common'

export async function balancesTransfer({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext) {
  const transfer = new Transfer()
  const [from, to, value] = new Balances.TransferEvent(event).params
  transfer.from = Buffer.from(from.toHex())
  transfer.to = Buffer.from(to.toHex())
  transfer.value = value.toBn()

  // if you want to use these - add them to input schema (`schema.graphql`)
  //transfer.tip = extrinsic ? new BN(extrinsic.tip.toString(10)) : new BN(0)
  //transfer.insertedAt = new Date(block.timestamp)
  //transfer.timestamp = new BN(block.timestamp)

  transfer.block = block.height
  transfer.comment = `Transferred ${transfer.value} from ${transfer.from} to ${transfer.to}`
  console.log(`Saving transfer: ${JSON.stringify(transfer, null, 2)}`)
  await store.save<Transfer>(transfer)
}

export async function timestampCall({
  store,
  event,
  block,
}: ExtrinsicContext & StoreContext) {
  const call = new Timestamp.SetCall(event)
  const blockT = new BlockTimestamp()
  blockT.timestamp = call.args.now.toBn()
  blockT.blockNumber = block.height
  await store.save<BlockTimestamp>(blockT)
}
