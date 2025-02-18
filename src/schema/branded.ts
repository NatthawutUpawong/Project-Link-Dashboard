/* eslint-disable ts/no-redeclare */
import * as S from "effect/Schema"

export const ProjectId = S.Number.pipe(S.brand("ProjectId")).annotations({ jsonSchema: { type: "number" } })
export type ProjectId = S.Schema.Type<typeof ProjectId>

export const ProjectIdFromString = S.transform(
  S.NumberFromString,
  ProjectId,
  {
    decode: id => ProjectId.make(id),
    encode: id => id,
  },
)

export const LinkId = S.Number.pipe(S.brand("LinkId")).annotations({ jsonSchema: { type: "number" } })
export type LinkId = S.Schema.Type<typeof LinkId>

export const LinkIdFromString = S.transform(
  S.NumberFromString,
  LinkId,
  {
    decode: id => LinkId.make(id),
    encode: id => id,
  },
)
