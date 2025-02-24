import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/index.js"
import { Branded, Helpers, ProjectWithRelationsSchema } from "../../schema/index.js"
import { ProjectServiceContext } from "../../services/project/indext.js"
// import * as Errors from "../../types/error/link-errors.js"

const getByIdResponseSchema = ProjectWithRelationsSchema.Schema.omit("deletedAt")

const getByIdDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(getByIdResponseSchema),
        },
      },
      description: "Get Project by Id",
    },
    404: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Get Project By Id Not Found",
    },
  },
  tags: ["Project"],
})

const getManyResponseSchema = S.Array(ProjectWithRelationsSchema.Schema.omit("deletedAt"))

const getManyDocs = describeRoute({
  responses: {
    200: {
      content: {
        "application/json": {
          schema: resolver(getManyResponseSchema),
        },
      },
      description: "Get Projects",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Get Projects Error",
    },
  },
  tags: ["Project"],
})

const validateProjectRequest = validator("param", S.Struct({
  ProjectId: Branded.ProjectIdFromString,
}))

export function setupProjectGetRoutes() {
  const app = new Hono()

  app.get("/:ProjectId", getByIdDocs, validateProjectRequest, async (c) => {
    const { ProjectId } = c.req.valid("param")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

    const program = ProjectServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding by Id Project")),
      Effect.andThen(svc => svc.findOneById(ProjectId)),
      // Effect.andThen(b=>b),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindProjectByIdError: () => Effect.succeed(c.json({ message: "find by Id error" }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: `not found Project for id: ${ProjectId}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /projecId.project.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  app.get("/", getManyDocs, async (c) => {
    const limit = Number(c.req.query("itemPerpage") ?? 10)
    const page = Number(c.req.query("page") ?? 1)
    const offset = (page - 1) * limit

    const program = ProjectServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding many Projects")),
      Effect.andThen(svc => svc.findManyPagination(limit, offset, page)),
      Effect.andThen(b => b),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindManyProjectError: () => Effect.succeed(c.json({ message: "find many error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /.project.controller /"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  // app.get("/", getManyDocs, async (c) => {
  //   const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

  //   const program = ProjectServiceContext.pipe(
  //     Effect.tap(() => Effect.log("start finding many Projects")),
  //     Effect.andThen(svc => svc.findMany()),
  //     Effect.andThen(parseResponse),
  //     Effect.andThen(data => c.json(data, 200)),
  //     Effect.tap(() => Effect.log("test")),
  //     Effect.catchTags({
  //       FindManyProjectError: () => Effect.succeed(c.json({ message: "find many error" }, 500)),
  //       ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
  //     }),
  //     Effect.annotateLogs({ key: "annotate" }),
  //     Effect.withLogSpan("test"),
  //     Effect.withSpan("GET /.project.controller /"),
  //   )

  //   const result = await ServicesRuntime.runPromise(program)
  //   return result
  // })

  return app
}
