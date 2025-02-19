import * as S from "effect/Schema"
import * as Branded from "./branded.js"
import * as GeneralSchema from "./general.js"

export const Schema = S.Struct({
  id: Branded.LinkId,
  image: S.String,
  name: S.String.annotations({ jsonSchema: { example: "Admin", title: "name", type: "string" } }),
  projectId: Branded.ProjectId,
  ...GeneralSchema.TimeStampSchema.fields,
  _tag: S.Literal("Link").pipe(S.optional, S.withDefaults({
    constructor: () => "Link" as const,
    decoding: () => "Link" as const,
  })),
})

export type Link = S.Schema.Type<typeof Schema>
export type LinkEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type LinkArray = S.Schema.Type<typeof SchemaArray>
export type LinkArrayEncoded = S.Schema.Encoded<typeof SchemaArray>

export const CreateSchema = Schema.omit("_tag", "id", "createdAt", "updatedAt", "deletedAt")
export type CreateLink = S.Schema.Type<typeof CreateSchema>
export type CreateLinkEncoded = S.Schema.Encoded<typeof CreateSchema>

export const UpdateSchema = Schema.omit("_tag", "createdAt", "updatedAt", "deletedAt")
export type UpdateLink = S.Schema.Type<typeof UpdateSchema>
