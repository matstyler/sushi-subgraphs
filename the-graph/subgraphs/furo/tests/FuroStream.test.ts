import { Address, BigInt } from '@graphprotocol/graph-ts'
import { clearStore, test, assert } from 'matchstick-as/assembly/index'
import { ONGOING } from './constants'
import { LogCreateStream as CreateStreamEvent } from './FuroStream/FuroStream'
import { createStreamEvent } from './mocks'

const WETH_ADDRESS = Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
const WBTC_ADDRESS = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
const SENDER = Address.fromString('0x00000000000000000000000000000000000a71ce')
const RECIEVER = Address.fromString('0x0000000000000000000000000000000000000b0b')
const STREAM_ID = BigInt.fromString('1001')
const AMOUNT = BigInt.fromString('1000000')
const START_TIME = BigInt.fromString('1648297495') // 	Sat Mar 26 2022 12:24:55 GMT+0000
const END_TIME = BigInt.fromString('1650972295') // 	Tue Apr 26 2022 11:24:55 GMT+0000, One month later
let streamEvent: CreateStreamEvent
function setup(): void {
  streamEvent = createStreamEvent(STREAM_ID, SENDER, RECIEVER, WETH_ADDRESS, AMOUNT, START_TIME, END_TIME, true)
}

function cleanup(): void {
  clearStore()
}

test('Stream entity contains expected fields', () => {
  setup()

  const id = STREAM_ID.toString()
  assert.fieldEquals('Stream', id, 'id', id)
  assert.fieldEquals('Stream', id, 'recipient', RECIEVER.toHex())
  assert.fieldEquals('Stream', id, 'amount', AMOUNT.toString())
  assert.fieldEquals('Stream', id, 'withdrawnAmount', '0')
  assert.fieldEquals('Stream', id, 'token', WETH_ADDRESS.toHex())
  assert.fieldEquals('Stream', id, 'status', ONGOING)
  assert.fieldEquals('Stream', id, 'createdBy', SENDER.toHex())
  assert.fieldEquals('Stream', id, 'fromBentoBox', 'true')
  assert.fieldEquals('Stream', id, 'startedAt', START_TIME.toString())
  assert.fieldEquals('Stream', id, 'exiresAt', END_TIME.toString())
  assert.fieldEquals('Stream', id, 'modifiedAtBlock', streamEvent.block.number.toString())
  assert.fieldEquals('Stream', id, 'modifiedAtTimestamp', streamEvent.block.timestamp.toString())

  cleanup()
})
