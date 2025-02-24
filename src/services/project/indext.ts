/* eslint-disable perfectionist/sort-objects */
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
          findManyPagination: (limit, offset, page) =>
            repo.findManyPagination(limit, offset).pipe(
              Effect.andThen(data =>
                repo.count().pipe(
                  Effect.andThen((totalItems) => {
                    const totalPages = Math.ceil(totalItems / limit)
                    const nextPage = page < totalPages ? `http://localhost:3000/project?page=${page + 1}&itemPerpage=${limit}` : `null`;
                    const prevPage = page > 1 ? `http://localhost:3000/project?page=${page - 1}&itemPerpage=${limit}` : `null`;

                    return {
                      data,
                      pagination: {
                        current_page: page,
                        item_perpage: limit,
                        total_pages: totalPages,
                        next_page: nextPage,
                        prev_page: prevPage,
                      },
                    }
                  }),
                ),
              ),
              Effect.withSpan("find-pagination.project.service"),
            ),
          findOneById: id => repo.findByIdWithRelations(id).pipe(
            Effect.withSpan("find-all-by-id.project.service"),
          ),
          removeById: id => repo.hardRemove(id).pipe(
            Effect.withSpan("remove-by-id.project.service"),
          ),
          update: (id, data) => repo.update(id, data).pipe(
            Effect.withSpan("update.project.service"),
          ),
        } satisfies ProjectService
      }),
    ),
  )
}
