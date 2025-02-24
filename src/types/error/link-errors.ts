import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"

export class CreateLinkError extends Data.TaggedError("CreateLinkError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FindLinkByIdError extends Data.TaggedError("FindLinkByIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FindManyLinkError extends Data.TaggedError("FindManyLinkError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FindLinkByNameError extends Data.TaggedError("FindLinkByNameError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class UpdateLinkError extends Data.TaggedError("UpdateLinkError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class RemoveLinkError extends Data.TaggedError("RemoveLinkError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class IdLinkAlreadyExitError extends Data.TaggedError("IdLinkAlreadyExitError")<ErrorMsg> {
  static new = createErrorFactory(this)
}
