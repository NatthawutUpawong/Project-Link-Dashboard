import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/index.js"
import { Branded, Helpers, LinkSchema, LinkWithRelationsSchema } from "../../schema/index.js"
import { LinkServiceContext } from "../../services/link/indext.js"
// import * as Errors from "../../types/error/link-errors.js"

export function setupLinkGetRoutes() {
  const app = new Hono()

  const getByIdResponseSchema = LinkWithRelationsSchema.Schema.omit("deletedAt")

  const getByIdDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getByIdResponseSchema),
          },
        },
        description: "Get Link by Id",
      },
      404: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Get Link By Id Not Found",
      },
    },
    tags: ["Link"],
  })

  const validateLinkIdRequest = validator("param", S.Struct({
    linkId: Branded.LinkIdFromString,
  }))

  app.get("/:linkId", getByIdDocs, validateLinkIdRequest, async (c) => {
    const { linkId } = c.req.valid("param")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getByIdResponseSchema)

    const program = LinkServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding by Id link")),
      Effect.andThen(svc => svc.findOneById(linkId)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindLinkByIdError: () => Effect.succeed(c.json({ message: "find by Id error" }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: `not found link for id: ${linkId}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /linkId.link.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  const getManyResponseSchema = S.Array(LinkWithRelationsSchema.Schema.omit("deletedAt"))

  const getManyDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getManyResponseSchema),
          },
        },
        description: "Get Links",
      },
      500: {
        content: {
          "application/json": {
            schema: resolver(S.Struct({
              message: S.String,
            })),
          },
        },
        description: "Get Links Error",
      },
    },
    tags: ["Link"],
  })

  app.get("/", getManyDocs, async (c) => {
    const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

    const program = LinkServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding many links")),
      Effect.andThen(svc => svc.findMany()),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindManyLinkError: () => Effect.succeed(c.json({ message: "find many error" }, 500)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /.link.controller /"),
    )

    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  const getNameDocs = describeRoute({
    responses: {
      200: {
        content: {
          "application/json": {
            schema: resolver(getManyResponseSchema),
          },
        },
        description: "Get Link by Id",
      },
      404: {
        content: {
          "application/json": {
            schema: resolver(getManyResponseSchema),
          },
        },
        description: "Get Link By Id Not Found",
      },
    },
    tags: ["Link"],
  })

  const getLinkByLinkNameValidateRequest = validator("param", S.Struct({
    linkName: LinkSchema.Schema.fields.name,
  }))

  app.get("link/:linkName", getNameDocs, getLinkByLinkNameValidateRequest, async (c) => {
    const { linkName } = c.req.valid("param")
    const parseResponse = Helpers.fromObjectToSchemaEffect(getManyResponseSchema)

    const program = LinkServiceContext.pipe(
      Effect.tap(() => Effect.log("start finding by Id link")),
      Effect.andThen(svc => svc.findOneByName(linkName)),
      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 200)),
      Effect.tap(() => Effect.log("test")),
      Effect.catchTags({
        FindLinkByNameError: () => Effect.succeed(c.json({ message: "find by Id error" }, 500)),
        NoSuchElementException: () => Effect.succeed(c.json({ message: `not found link name: ${linkName}` }, 404)),
        ParseError: () => Effect.succeed(c.json({ message: "parse error" }, 500)),
      }),
      Effect.annotateLogs({ key: "annotate" }),
      Effect.withLogSpan("test"),
      Effect.withSpan("GET /linkname.link.controller /"),
    )
    const result = await ServicesRuntime.runPromise(program)
    return result
  })

  return app
}
