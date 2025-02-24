import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/index.js"
import { Branded, Helpers, ProjectSchema } from "../../schema/index.js"
import { ProjectServiceContext } from "../../services/project/indext.js"
import * as Errors from "../../types/error/project-errors.js"

const responseSchema = ProjectSchema.Schema.omit("deletedAt")

const putDocs = honoOpenapi.describeRoute({
  responses: {
    200: {
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

const validateRequestBody = validator("json", ProjectSchema.UpdateSchema)
const validateUpdateParam = validator("param", S.Struct({
  ProjectId: Branded.ProjectIdFromString,
}))

export function setupProjectPutRoutes() {
  const app = new Hono()

  app.put("/:ProjectId", putDocs, validateRequestBody, validateUpdateParam, async (c) => {
    const body = c.req.valid("json")
    const { ProjectId } = c.req.valid("param")

    const parseResponse = Helpers.fromObjectToSchemaEffect(responseSchema)

    const programs = Effect.all({
      projectServices: ProjectServiceContext,
    }).pipe(
      Effect.tap(() => Effect.log("Update starting")),
      Effect.tap(({ projectServices }) => projectServices.findOneById(ProjectId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(Errors.FindProjectByIdError.new(`Not found Id: ${ProjectId}`)())),
      )),
      Effect.andThen(({ projectServices }) => projectServices.update(ProjectId, body)),

      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        FindProjectByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        UpdateProjectError: () => Effect.succeed(c.json({ message: "update failed" }, 500)),
      }),
      Effect.withSpan("PUT /.project.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
