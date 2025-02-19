import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, ProjectSchema, ProjectWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/project-errors.js"

export type ProjectService = {
  create: (data: ProjectSchema.CreateProject) => Effect.Effect<ProjectSchema.Project, Errors.CreateProjectError | ParseError>
  findOneById: (id: Branded.ProjectId) => Effect.Effect<ProjectWithRelationsSchema.ProjectWithRelations, Errors.FindProjectByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<ProjectWithRelationsSchema.ProjectWithRelationsArray, Errors.FindManyProjectError>
  // update: (id: Branded.ProjectId, data: ProjectSchema.UpdateProject) => Effect.Effect<ProjectSchema.Project, Errors.UpdateProjectError | ParseError>
  // removeById: (id: Branded.ProjectId) => Effect.Effect<ProjectSchema.Project, Errors.RemoveProjectError>
}
