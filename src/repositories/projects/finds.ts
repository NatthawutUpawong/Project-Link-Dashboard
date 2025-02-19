import type { PrismaClient } from "@prisma/client"
import type { ProjectRepository } from "../../types/repositories/project.js"
import { Effect } from "effect"
import { Helpers, ProjectSchema, ProjectWithRelationsSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/project-errors.js"

export function findMany(prismaClient: PrismaClient): ProjectRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyProjectError.new(),
    try: () => prismaClient.project.findMany({
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.SchemaArray)),
    Effect.withSpan("find-many.projects.repository"),
  )
}

export function findManyWithRelations(prismaClient: PrismaClient): ProjectRepository["findManyWithRelations"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyProjectError.new(),
    try: () => prismaClient.project.findMany({
      include: {
        link: true
      },
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(ProjectWithRelationsSchema.SchemaArray)),
    Effect.withSpan("find-many.projects.repository"),
  )
}

export function findByIdWithRelations(prismaClient: PrismaClient): ProjectRepository["findByIdWithRelations"] {
  return id => Effect.tryPromise({
    catch: Errors.FindProjectByIdError.new(),
    try: () => prismaClient.project.findUnique({
      include: {
        link: true,
      },
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectWithRelationsSchema.Schema)),
    Effect.withSpan("find-by-id-with-relations.project.repository"),
  )
}

export function findById(prismaClient: PrismaClient): ProjectRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.FindProjectByIdError.new(),
    try: () => prismaClient.project.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(ProjectSchema.Schema)),
    Effect.withSpan("find-by-id.project.repository"),
  )
}
