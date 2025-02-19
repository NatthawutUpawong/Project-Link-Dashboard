import type { Effect } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, LinkSchema, LinkWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/link-errors.js"

export type LinkService = {
  create: (data: LinkSchema.CreateLink) => Effect.Effect<LinkSchema.Link, Errors.CreateLinkError | ParseError>
  findOneById: (id: Branded.LinkId) => Effect.Effect<LinkWithRelationsSchema.LinkWithRelations, Errors.FindLinkByIdError | ParseError | NoSuchElementException>
  findMany: () => Effect.Effect<LinkSchema.LinkArray, Errors.FindManyLinkError | ParseError>

  // findMany: () => Effect.Effect<LinkSchema.Link, Errors.FindManyLinkError>

  // findallById: (id: Branded.UserId) => Effect.Effect<UserSchema.User, Errors.FindUserByIdError | ParseError | NoSuchElementException>
  // findByUsername: (username: Branded.UsernameType) => Effect.Effect<UserSchema.User, Errors.FindUserByUsernameError | ParseError | NoSuchElementException>
  // update: (id: Branded.UserId, data: UserSchema.UpdateUser) => Effect.Effect<UserSchema.User, Errors.UpdateUserErro | ParseError>
  // removeById: (id: Branded.UserId) => Effect.Effect<UserSchema.User, Errors.RemoveUserError>
}
