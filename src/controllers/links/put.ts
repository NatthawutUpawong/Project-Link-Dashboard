import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/index.js"
import { Branded, Helpers, LinkSchema } from "../../schema/index.js"
import { LinkServiceContext } from "../../services/link/indext.js"
import { ProjectServiceContext } from "../../services/project/indext.js"
import * as ErrorsLink from "../../types/error/link-errors.js"
import * as ErrorsProject from "../../types/error/project-errors.js"

const responseSchema = LinkSchema.Schema.omit("deletedAt")

const putDocss = honoOpenapi.describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(responseSchema),
        },
      },
      description: "Create Link",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Created Link Error",
    },
  },
  tags: ["Link"],
})

const validateRequestBody = validator("json", LinkSchema.UpdateSchema)
const validateUpdateParam = validator("param", S.Struct({
  linkId: Branded.LinkIdFromString,
}))

export function setupLinkPutRoutes() {
  const app = new Hono()

  app.put("/:linkId", putDocss, validateRequestBody, validateUpdateParam, async (c) => {
    const body = c.req.valid("json")
    const { linkId } = c.req.valid("param")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      linkServices: LinkServiceContext,
      projectServices: ProjectServiceContext,

    }).pipe(
      Effect.tap(() => Effect.log("Update starting")),
      Effect.andThen(b => b),

      Effect.tap(({ linkServices }) => linkServices.findOneById(linkId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(ErrorsLink.FindLinkByIdError.new(`Not found Link Id: ${linkId}`)())),
      )),

      Effect.tap(({ projectServices }) => projectServices.findOneById(body.projectId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(ErrorsProject.FindProjectByIdError.new(`Not found Project Id: ${body.projectId}`)())),
      )),

      Effect.tap(({ linkServices }) => linkServices.findOneById(body.id).pipe(
        Effect.catchTag("NoSuchElementException", () => Effect.succeed(null)),
        Effect.andThen(existingLink =>
          existingLink && existingLink.id !== linkId
            ? Effect.fail(ErrorsLink.IdLinkAlreadyExitError.new(`Id: ${existingLink.id} already exists`)())
            : Effect.void,
        ),
      )),

      Effect.andThen(b => b),
      Effect.andThen(({ linkServices }) => linkServices.update(linkId, body)),

      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        FindLinkByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        FindProjectByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        IdLinkAlreadyExitError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        UpdateLinkError: () => Effect.succeed(c.json({ message: "update failed" }, 500)),
      }),
      Effect.withSpan("PUT /.link.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
