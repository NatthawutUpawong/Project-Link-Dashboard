import type { PrismaClient } from "@prisma/client"
import type { LinkRepository } from "../../types/repositories/link.js"
import { Effect } from "effect"
import { Helpers, LinkSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/link-errors.js"

export function update(prismaClient: PrismaClient): LinkRepository["update"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.UpdateLinkError.new(),
    try: () => prismaClient.link.update({
      data,
      where: {
        deletedAt: null,
        id
      }
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkSchema.Schema)),
    Effect.withSpan("update.link.repository")
  )
}

export function updatePartial(prismaClient: PrismaClient): LinkRepository["updatePartial"] {
  return (id, data) => Effect.tryPromise({
    catch: Errors.UpdateLinkError.new(),
    try: () => prismaClient.project.update({
      data,
      where: {
        deletedAt: null,
        id
      }
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkSchema.Schema)),
    Effect.withSpan("updatePartial.link.repository")
  )
}