import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { Entity } from '../generated/graphql-server/src/modules/entity/entity.model'
import { hex2a } from './util'

export async function tfgridModule_EntityStored(db: DB, event: SubstrateEvent) {
  const [version, entity_id, name, country_id, city_id, account_id] = event.params
  const entity = new Entity()
  entity.gridVersion = version.value as number
  entity.entityId = entity_id.value as number
  entity.name = hex2a(Buffer.from(name.value as string).toString())
  entity.countryId = country_id.value as number
  entity.cityId = city_id.value as number
  entity.address = Buffer.from(account_id.value as string).toString()

  await db.save<Entity>(entity)
}

export async function tfgridModule_EntityUpdated(db: DB, event: SubstrateEvent) {
  const [entity_id, name, country_id, city_id, account_id] = event.params

  const savedEntity = await db.get(Entity, { where: { entityId: entity_id.value as number } })

  if (savedEntity) {
    savedEntity.entityId = entity_id.value as number
    savedEntity.name = hex2a(Buffer.from(name.value as string).toString())
    savedEntity.countryId = country_id.value as number
    savedEntity.cityId = city_id.value as number
    savedEntity.address = Buffer.from(account_id.value as string).toString()
  
    await db.save<Entity>(savedEntity)
  }
}

export async function tfgridModule_EntityDeleted(db: DB, event: SubstrateEvent) {
  const [entity_id] = event.params

  const savedEntity = await db.get(Entity, { where: { entityId: entity_id.value as number } })

  if (savedEntity) {
    await db.remove(savedEntity)
  }
}
