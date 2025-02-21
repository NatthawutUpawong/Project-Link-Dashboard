import * as S from "effect/Schema"

import * as LinkSchema from "./link.js"
import * as ProjectSchema from "./project.js"

export const Schema = S.Struct({
  ...LinkSchema.Schema.fields,
  project: ProjectSchema.Schema.omit("deletedAt"),
     
})

export type LinkWithRelations = S.Schema.Type<typeof Schema>
export type LinkWithRelationsEncoded = S.Schema.Encoded<typeof Schema>

export const SchemaArray = S.Array(Schema)
export type LinkWithRelationsArray = S.Schema.Type<typeof SchemaArray>
export type LinkWithRelationsArrayEncoded = S.Schema.Encoded<typeof SchemaArray>

