import type { PrismaClient } from "@prisma/client"
import type { LinkRepository } from "../../types/repositories/link.js"
import { Effect } from "effect"
import { Helpers, LinkSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/link-errors.js"

export function create(prismaClient: PrismaClient): LinkRepository["create"] {
  return data => Effect.tryPromise({
    catch: Errors.CreateLinkError.new(),
    try: () => prismaClient.link.create({
      data
    }),

  }).pipe(
    // Effect.tap(v => console.log(v)),
    Effect.andThen(Helpers.fromObjectToSchema(LinkSchema.Schema)),
    Effect.withSpan("create.link.repositoty"),
  )
}
