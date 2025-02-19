import type { ErrorMsg } from "../error.helpers.js"
import { Data } from "effect"
import { createErrorFactory } from "../error.helpers.js"

export class CreateProjectError extends Data.TaggedError("CreateProjectError")<ErrorMsg> {
  static new = (msg?: string) => (error?: unknown) => new CreateProjectError({ error, msg })
}

// export class HashedPasswordError extends Data.TaggedError("HashedPasswordError")<ErrorMsg> {
//   static new = (msg?: string) => (error?: unknown) => new HashedPasswordError({ error, msg })
// }

// export class VerifyPasswordError extends Data.TaggedError("VerifyPasswordError")<ErrorMsg> {
//   static new = (msg?: string) => (error?: unknown) => new VerifyPasswordError({ error, msg })
// }

// export class InvalidPasswordError extends Data.TaggedError("InvalidPasswordError")<ErrorMsg> {
//   static new = (msg?: string) => (error?: unknown) => new InvalidPasswordError({ error, msg })
// }

// export class isPassword8CharLongError extends Data.TaggedError("isPassword8CharLongError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

// export class isPasswordContainsSpecialCharError extends Data.TaggedError("isPasswordContainsSpecialCharError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

// export class SignTokenError extends Data.TaggedError("SignTokenError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

// export class VerifyTokenError extends Data.TaggedError("VerifyTokenError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

export class FindProjectByIdError extends Data.TaggedError("FindProjectByIdError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

export class FindManyProjectError extends Data.TaggedError("FindManyProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

// export class FindUserByUsernameError extends Data.TaggedError("FindUserByUsernameError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

export class UpdateProjectError extends Data.TaggedError("UpdateProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

// export class GetProfileUserError extends Data.TaggedError("GetProfileUserError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

export class RemoveProjectError extends Data.TaggedError("RemoveProjectError")<ErrorMsg> {
  static new = createErrorFactory(this)
}

// export class LoginUserError extends Data.TaggedError("LoginUserError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

// export class LogoutUserError extends Data.TaggedError("LogoutUserError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

// export class UsernameAlreadyExitError extends Data.TaggedError("UsernameAlreadyExitError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }

// export class IdAlreadyExitError extends Data.TaggedError("IdAlreadyExitError")<ErrorMsg> {
//   static new = createErrorFactory(this)
// }
