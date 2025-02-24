import type { PrismaClient } from "@prisma/client"
import type { LinkRepository } from "../../types/repositories/link.js"
import { Effect } from "effect"
import { Helpers, LinkSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/link-errors.js"

export function remove(prismaClient: PrismaClient): LinkRepository["remove"] {
  return id => Effect.tryPromise({
    catch: Errors.RemoveLinkError.new(),
    try: () => prismaClient.link.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      }
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkSchema.Schema)),
    Effect.withSpan("remove.link.repository")
  )
}

export function hardRemoveById(prismaClient: PrismaClient): LinkRepository["hardRemove"] {
  return id => Effect.tryPromise({
    catch: Errors.RemoveLinkError.new(),
    try: () => prismaClient.link.delete({
      where: {
        id,
      }
    })
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkSchema.Schema)),
    Effect.withSpan("hard-remove.link.repostory")
  )
}
