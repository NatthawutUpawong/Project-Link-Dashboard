import type { LinkRepository } from "../repositories/link.js"

export type LinkService = {
  create: LinkRepository["create"]
  findOneById: LinkRepository["findByIdWithRelations"]
  findOneByName: LinkRepository['findByNameWithRelations']
  findMany: LinkRepository["findManyWithRelations"]
  update: LinkRepository["update"]
  remove: LinkRepository["remove"]
}
