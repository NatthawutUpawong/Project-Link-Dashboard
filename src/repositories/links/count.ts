import type { PrismaClient } from "@prisma/client"
import type { LinkRepository } from "../../types/repositories/link.js"
import { Effect } from "effect"
import * as Errors from "../../types/error/link-errors.js"

export function count(prismaClient: PrismaClient): LinkRepository["count"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyLinkError.new(),
    try: () => prismaClient.link.count({
      where: { deletedAt: null },
    }),

  }).pipe(
    Effect.tap(b => console.log(b)),
    Effect.withSpan("count.link.repositoty"),
  )
}
