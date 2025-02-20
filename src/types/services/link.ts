import type { LinkRepository } from "../repositories/link.js"

export type LinkService = {
  create: LinkRepository["create"]
  findOneById: LinkRepository["findByIdWithRelations"]
  findMany: LinkRepository["findManyWithRelations"]
  update: LinkRepository["update"]
  remove: LinkRepository["remove"]
}
