import type { Effect } from "effect"
import type { paginationSchema, ProjectWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/project-errors.js"
import type { ProjectRepository } from "../repositories/project.js"

export type ProjectService = {
  create: ProjectRepository["create"]
  findOneById: ProjectRepository["findByIdWithRelations"]
  findMany: ProjectRepository["findManyWithRelations"]
  findManyPagination: (limit: number, offset: number, page: number) => Effect.Effect<{
    data: ProjectWithRelationsSchema.ProjectWithRelationsArray
    pagination: paginationSchema.pagination
  }, Errors.FindManyProjectError>
  update: ProjectRepository["update"]
  removeById: ProjectRepository["remove"]
}