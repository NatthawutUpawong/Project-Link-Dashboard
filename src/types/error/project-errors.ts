import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"

export class CreateProjectError extends Data.TaggedError("CreateProjectError")<ErrorMsg> {
  static new = (msg?: string) => (error?: unknown) => new CreateProjectError({ error, msg })
}

export class FindProjectByIdError extends Data.TaggedError("FindProjectByIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FindManyProjectError extends Data.TaggedError("FindManyProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class UpdateProjectError extends Data.TaggedError("UpdateProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class RemoveProjectError extends Data.TaggedError("RemoveProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}
