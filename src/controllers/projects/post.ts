import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/indext.js"
import { Helpers, ProjectSchema } from "../../schema/index.js"
import { ProjectServiceContext } from "../../services/project/indext.js"
// import * as Errors from "../../types/error/project-errors.js"

const responseSchema = ProjectSchema.Schema.omit("deletedAt")

const postDocs = honoOpenapi.describeRoute({
  responses: {
    201: {
      content: {
        "application/json": {
          schema: resolver(responseSchema),
        },
      },
      description: "Create Project",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Created Project Error",
    },
  },
  tags: ["Project"],
})

const validateRequestBody = validator("json", ProjectSchema.CreateSchema)

export function setupProjectPostRoutes() {
  const app = new Hono()

  app.post("/", postDocs, validateRequestBody, async (c) => {
    const body = c.req.valid("json")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      projectServices: ProjectServiceContext,
    }).pipe(
      Effect.tap(() => Effect.log("Create starting")),

      Effect.andThen(({ projectServices }) => projectServices.create(body)),

      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        CreateProjectError: e => Effect.succeed(c.json({ message: e.msg }, 500)),
      }),
      Effect.withSpan("POST /.project.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
