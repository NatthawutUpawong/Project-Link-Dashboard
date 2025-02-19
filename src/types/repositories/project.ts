import type { Effect } from "effect"

import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, ProjectSchema, ProjectWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/project-errors.js"

type Project = ProjectSchema.Project

export type ProjectRepository = {
  create: (data: ProjectSchema.CreateProjectEncoded) => Effect.Effect<Project, Errors.CreateProjectError | ParseError>
  findById: (id: Branded.ProjectId) => Effect.Effect<Project, Errors.FindProjectByIdError | ParseError | NoSuchElementException>
  findByIdWithRelations: (id: Branded.ProjectId) => Effect.Effect<ProjectWithRelationsSchema.ProjectWithRelations, Errors.FindProjectByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<ProjectSchema.ProjectArray, Errors.FindManyProjectError>
  findManyWithRelations: () => Effect.Effect<ProjectWithRelationsSchema.ProjectWithRelationsArray, Errors.FindManyProjectError>
  // update: (id: Branded.ProjectId, data: ProjectSchema.UpdateProjectEncoded) => Effect.Effect<Project, Errors.UpdateProjectError | ParseError>
  // updatePartial: (id: Branded.ProjectId, data: Partial<ProjectSchema.UpdateProjectEncoded>) => Effect.Effect<Project, Errors.UpdateProjectError>
  // remove: (id: Branded.ProjectId) => Effect.Effect<Project, Errors.RemoveProjectError>
  // hardRemove: (id: Branded.ProjectId) => Effect.Effect<Project, Errors.RemoveProjectError>
}

// ParseError คือ Parse Effect Schema ไม่ผ่าน
// NoSuchElementException เป็น error ที่ใช้บอกว่าไม่มี element นั้นๆ
