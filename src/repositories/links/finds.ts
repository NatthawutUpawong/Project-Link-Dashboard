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
      },
    }),
  }).pipe(
    Effect.andThen(Helpers.fromObjectToSchema(LinkWithRelationsSchema.SchemaArray)),
    Effect.withSpan("find-many.link.repository"),
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
      },
    }),
  }).pipe(
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

// export function findallById(prismaClient: PrismaClient): UserRepository["findallById"] {
//   return id => Effect.tryPromise({
//     catch: Errors.FindUserByIdError.new(),
//     try: () => prismaClient.user.findUnique({
//       where: {
//         id,
//       },
//     }),
//   }).pipe(
//     Effect.andThen(Effect.fromNullable),
//     Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
//     Effect.withSpan("find-by-id.user.repository"),
//   )
// }

// export function findByusername(prismaClient: PrismaClient): UserRepository["findByUsername"] {
//   return username => Effect.tryPromise({
//     catch: Errors.FindUserByUsernameError.new(),
//     try: () => prismaClient.user.findUnique({
//       where: {
//         deletedAt: null,
//         username,
//       },
//     }),
//   }).pipe(
//     Effect.andThen(Effect.fromNullable),
//     Effect.andThen(Helpers.fromObjectToSchema(UserSchema.Schema)),
//     Effect.withSpan("find-by-username.username.repository"),
//   )
// }
