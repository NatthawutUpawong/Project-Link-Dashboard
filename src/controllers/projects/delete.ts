import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/index.js"
import { Branded, Helpers, ProjectSchema } from "../../schema/index.js"
import { ProjectServiceContext } from "../../services/project/indext.js"
import * as Errors from "../../types/error/project-errors.js"

const deleteponseSchema = ProjectSchema.Schema.omit("deletedAt")

const deleteDocs = honoOpenapi.describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(deleteponseSchema),
        },
      },
      description: "Delete Project",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Delete Project Error",
    },
  },
  tags: ["Project"],
})

const validateDeleteParam = validator("param", S.Struct({
  ProjectId: Branded.ProjectIdFromString,
}))

export function setupProjectDeleteRoutes() {
  const app = new Hono()

  app.delete("/:ProjectId", deleteDocs, validateDeleteParam, async (c) => {
    const { ProjectId } = c.req.valid("param")

    const parseResponse = Helpers.fromObjectToSchemaEffect(deleteponseSchema)

    const programs = Effect.all({
      projectServices: ProjectServiceContext,
    }).pipe(
      Effect.tap(() => Effect.log("Update starting")),
      Effect.andThen(b => b),
      Effect.tap(({ projectServices }) => projectServices.findOneById(ProjectId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(Errors.FindProjectByIdError.new(`Not found Id: ${ProjectId}`)())),
      )),
      Effect.andThen(({ projectServices }) => projectServices.removeById(ProjectId)),

      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        FindProjectByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        RemoveProjectError: () => Effect.succeed(c.json({ message: "remove failed" }, 500)),
      }),
      Effect.withSpan("DELETE /.project.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
