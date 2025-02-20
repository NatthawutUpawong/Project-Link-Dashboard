import * as S from "effect/Schema"

import * as LinkSchema from "./link.js"
import * as ProjectSchema from "./project.js"

export const Schema = S.Struct({
  ...ProjectSchema.Schema.fields,
  link: S.Array(LinkSchema.Schema.omit("deletedAt")),

})

export type ProjectWithRelations = S.Schema.Type<typeof Schema>
export type ProjectWithRelationsEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type ProjectWithRelationsArray = S.Schema.Type<typeof SchemaArray>
export type ProjectWithRelationsArrayEncoded = S.Schema.Encoded<typeof SchemaArray>
