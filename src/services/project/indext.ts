import type { ProjectService } from "../../types/services/project.js"
import { Context, Effect, Layer } from "effect"
import { ProjectRepositoryContext } from "../../repositories/projects/index.js"

export class ProjectServiceContext extends Context.Tag("service/Project")<ProjectServiceContext, ProjectService>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      repo: ProjectRepositoryContext,
    }).pipe(
      Effect.andThen(({ repo }) => {
        return {
          create: data => repo.create(data).pipe(
            Effect.withSpan("create.project.service"),
          ),
          findMany: () => repo.findManyWithRelations().pipe(
            Effect.withSpan("find-many.project.service"),
          ),
          findOneById: id => repo.findByIdWithRelations(id).pipe(
            Effect.withSpan("find-all-by-id.project.service"),
          ),
          // findallById: id => repo.findallById(id).pipe(
          //   Effect.withSpan("find-all-by-id.user.service"),
          // ),
          // findByUsername: username => repo.findByUsername(username).pipe(
          //   Effect.withSpan("find-by-username.user.service"),
          // ),
          // findMany: () => repo.findMany().pipe(
          //   Effect.withSpan("find-many.user.service"),
          // ),
          // findOneById: id => repo.findById(id).pipe(
          //   Effect.withSpan("find-by-id.user.service"),
          // ),
          // removeById: id => repo.remove(id).pipe(
          //   Effect.withSpan("remove-by-id.service")
          // ),
          // update: (id, data) => repo.update(id, data).pipe(
          //   Effect.withSpan("update.user.service"),
          // ),
        } satisfies ProjectService
      }),
    ),
  )
}
