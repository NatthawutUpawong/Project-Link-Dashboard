import type { LinkRepository } from "../repositories/link.js"
import type { Effect } from "effect"
import type { paginationSchema, LinkWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/link-errors.js"

export type LinkService = {
  create: LinkRepository["create"]
  findOneById: LinkRepository["findByIdWithRelations"]
  findOneByName: LinkRepository['findByNameWithRelations']
  findMany: LinkRepository["findManyWithRelations"]
  findManyPagination: (limit: number, offset: number, page: number) => Effect.Effect<{
      data: LinkWithRelationsSchema.LinkWithRelationsArray
      pagination: paginationSchema.pagination
    }, Errors.FindManyLinkError>
  update: LinkRepository["update"]
  remove: LinkRepository["remove"]
}


