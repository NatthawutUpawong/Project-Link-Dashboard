/* eslint-disable perfectionist/sort-objects */
import * as S from "effect/Schema"


export const Schema = S.Struct({
  current_page: S.Number,
  item_perpage: S.Number,
  total_pages: S.Number,
  next_page: S.String,
  prev_page: S.String,
})

export type pagination = S.Schema.Type<typeof Schema>
export type paginationEncode = S.Schema.Encoded<typeof Schema>