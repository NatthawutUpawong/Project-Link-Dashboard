import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Helpers, LinkSchema } from "../../schema/index.js"
import { LinkServiceContext } from "../../services/link/indext.js"
// import * as Errors from "../../types/error/project-errors.js"

const responseSchema = LinkSchema.Schema.omit("deletedAt")

const postDocs = honoOpenapi.describeRoute({
  responses: {
    201: {
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

const validateRequestBody = validator("json", LinkSchema.CreateSchema)

export function setupLinkPostRoutes() {
  const app = new Hono()

  app.post("/", postDocs, validateRequestBody, async (c) => {
    const body = c.req.valid("json")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      linkServices: LinkServiceContext,
    }).pipe(
      Effect.tap(() => Effect.log("Create starting")),
      Effect.andThen(b => b),

      Effect.andThen(({ linkServices }) => linkServices.create(body)),
      Effect.andThen(b => b),

      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),

      Effect.catchTags({
        CreateLinkError: () => Effect.succeed(c.json({ message: "Create Link Error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "Parse Error" }, 500)),
      }),
      Effect.withSpan("POST /.link.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
