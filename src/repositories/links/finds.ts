import type { PrismaClient } from "@prisma/client"
import type { LinkRepository } from "../../types/repositories/link.js"
import { Effect } from "effect"
import { Helpers, LinkSchema, LinkWithRelationsSchema } from "../../schema/index.js"
import * as Errors from "../../types/error/link-errors.js"

export function findMany(prismaClient: PrismaClient): LinkRepository["findMany"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyLinkError.new(),
    try: () => prismaClient.link.findMany({
      where: {
        deletedAt: null,
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkSchema.SchemaArray)),
    Effect.withSpan("find-many.link.repository"),
  )
}

export function findManyWithRelations(prismaClient: PrismaClient): LinkRepository["findManyWithRelations"] {
  return () => Effect.tryPromise({
    catch: Errors.FindManyLinkError.new(),
    try: () => prismaClient.link.findMany({
      include: {
        project: true,
      },
      where: {
        deletedAt: null,
        project: {
          is: { deletedAt: null },
        },
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkWithRelationsSchema.SchemaArray)),
    Effect.withSpan("find-many.link.repository"),

  )
}
export function findManyPagination(prismaClient: PrismaClient): LinkRepository["findManyPagination"] {
  return (limit, offset) => Effect.tryPromise({
    catch: Errors.FindManyLinkError.new(),
    try: () => prismaClient.link.findMany({
      include: {
        project: true,
      },
      skip: offset,
      take: limit,
      where: {
        deletedAt: null,
        project: {
          is: { deletedAt: null },
        },
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkWithRelationsSchema.SchemaArray)),
    Effect.tap(b => console.log(b)),
    Effect.withSpan("find-many.link.repository"),

  )
}

export function findByName(prismaClient: PrismaClient): LinkRepository["findByNameWithRelations"] {
  return name => Effect.tryPromise({
    catch: Errors.FindLinkByNameError.new(),
    try: () => prismaClient.link.findMany({
      include: {
        project: true,
      },
      where: {
        deletedAt: null,
        name,
        project: {
          is: { deletedAt: null },
        },
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(LinkWithRelationsSchema.SchemaArray)),
    // Effect.tap(b => console.log(b)),
    Effect.withSpan("find-by-name.link.repository"),
  )
}

export function findByIdWithRelations(prismaClient: PrismaClient): LinkRepository["findByIdWithRelations"] {
  return id => Effect.tryPromise({
    catch: Errors.FindLinkByIdError.new(),
    try: () => prismaClient.link.findUnique({
      include: {
        project: true,
      },
      where: {
        deletedAt: null,
        id,
        project: {
          is: { deletedAt: null },
        },
      },
    }),
  }).pipe(
    // Effect.tap(d => console.log(d)),
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(LinkWithRelationsSchema.Schema)),
    Effect.withSpan("find-by-id-with-relations.link.repository"),
  )
}

export function findById(prismaClient: PrismaClient): LinkRepository["findById"] {
  return id => Effect.tryPromise({
    catch: Errors.FindLinkByIdError.new(),
    try: () => prismaClient.link.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    }),
  }).pipe(
    Effect.andThen(Effect.fromNullable),
    Effect.andThen(Helpers.fromObjectToSchema(LinkSchema.Schema)),
    Effect.withSpan("find-by-id.link.repository"),
  )
}
