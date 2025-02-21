import type { LinkService } from "../../types/services/link.js"
import { Context, Effect, Layer } from "effect"
import { LinkRepositoryContext } from "../../repositories/links/index.js"

export class LinkServiceContext extends Context.Tag("service/link")<LinkServiceContext, LinkService>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      repo: LinkRepositoryContext,
    }).pipe(
      Effect.andThen(({ repo }) => {
        return {
          create: data => repo.create(data).pipe(
            Effect.withSpan("create.link.service"),
          ),
          findMany: () => repo.findManyWithRelations().pipe(
            Effect.withSpan("find-many.link.service"),
          ),
          findOneById: id => repo.findByIdWithRelations(id).pipe(
            Effect.withSpan("find-all-by-id.link.service"),
          ),
          findOneByName: id => repo.findByNameWithRelations(id).pipe(
            Effect.withSpan("find-all-by-id.link.service"),
          ),
          remove: id => repo.hardRemove(id).pipe(
            Effect.withSpan("remove-by-id.service"),
          ),
          update: (id, data) => repo.update(id, data).pipe(
            Effect.withSpan("update.link.service"),
          ),
        } satisfies LinkService
      }),
    ),
  )
}
