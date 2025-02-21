import type { Effect } from "effect"

import type { NoSuchElementException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { Branded, LinkSchema, LinkWithRelationsSchema } from "../../schema/index.js"
import type * as Errors from "../error/link-errors.js"

export type LinkRepository = {
  create: (data: LinkSchema.CreateLink) => Effect.Effect<LinkSchema.Link, Errors.CreateLinkError | ParseError>
  findById: (id: Branded.LinkId) => Effect.Effect<LinkSchema.Link, Errors.FindLinkByIdError | ParseError | NoSuchElementException>
  findByIdWithRelations: (id: Branded.LinkId) => Effect.Effect<LinkWithRelationsSchema.LinkWithRelations, NoSuchElementException | ParseError | Errors.FindLinkByIdError>
  findByNameWithRelations: (name: LinkSchema.Link["name"]) => Effect.Effect<LinkWithRelationsSchema.LinkWithRelationsArray, NoSuchElementException | ParseError | Errors.FindLinkByNameError>
  findMany: () => Effect.Effect<LinkSchema.LinkArray, Errors.FindManyLinkError>
  findManyWithRelations: () => Effect.Effect<LinkWithRelationsSchema.LinkWithRelationsArray, Errors.FindManyLinkError>
  update: (id: Branded.LinkId, data: LinkSchema.UpdateLink) => Effect.Effect<LinkSchema.Link, Errors.UpdateLinkError | ParseError>
  updatePartial: (id: Branded.LinkId, data: Partial<LinkSchema.UpdateLink>) => Effect.Effect<LinkSchema.Link, Errors.UpdateLinkError | ParseError>
  remove: (id: Branded.LinkId) => Effect.Effect<LinkSchema.Link, NoSuchElementException | Errors.RemoveLinkError | ParseError>
  hardRemove: (id: Branded.LinkId) => Effect.Effect<LinkSchema.Link, NoSuchElementException | Errors.RemoveLinkError | ParseError>
}

// ParseError คือ Parse Effect Schema ไม่ผ่าน
// NoSuchElementException เป็น error ที่ใช้บอกว่าไม่มี element นั้นๆ
