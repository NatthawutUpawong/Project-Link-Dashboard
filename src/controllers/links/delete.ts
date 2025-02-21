import { Effect } from "effect"
import * as S from "effect/Schema"
import { Hono } from "hono"
import * as honoOpenapi from "hono-openapi"
import { resolver, validator } from "hono-openapi/effect"
import { ServicesRuntime } from "../../runtime/index.js"
import { Branded, Helpers, LinkSchema } from "../../schema/index.js"
import { LinkServiceContext } from "../../services/link/indext.js"
import * as Errors from "../../types/error/link-errors.js"

const deleteponseSchema = LinkSchema.Schema.omit("deletedAt")

const deleteDocs = honoOpenapi.describeRoute({
  responses: {
    201: {
      content: {
        "application/json": {
          schema: resolver(deleteponseSchema),
        },
      },
      description: "Delete Link",
    },
    500: {
      content: {
        "application/json": {
          schema: resolver(S.Struct({
            message: S.String,
          })),
        },
      },
      description: "Delete Link Error",
    },
  },
  tags: ["Link"],
})

const validateDeleteParam = validator("param", S.Struct({
  LinkId: Branded.LinkIdFromString,
}))

export function setupLinkDeleteRoutes() {
  const app = new Hono()

  app.delete("/:LinkId", deleteDocs, validateDeleteParam, async (c) => {
    const { LinkId } = c.req.valid("param")

    const parseResponse = Helpers.fromObjectToSchemaEffect(deleteponseSchema)

    const programs = Effect.all({
      linktServices: LinkServiceContext,
    }).pipe(
      Effect.tap(() => Effect.log("Delete starting")),
      Effect.andThen(b => b),
      Effect.tap(({ linktServices }) => linktServices.findOneById(LinkId).pipe(
        Effect.catchTag("NoSuchElementException", () =>
          Effect.fail(Errors.FindLinkByIdError.new(`Not found Id: ${LinkId}`)())),
      )),
      Effect.andThen(({ linktServices }) => linktServices.remove(LinkId)),

      Effect.andThen(parseResponse),
      Effect.andThen(data => c.json(data, 201)),
      Effect.catchTags({
        FindLinkByIdError: e => Effect.succeed(c.json({ message: e.msg }, 404)),
        ParseError: () => Effect.succeed(c.json({ messgae: "Parse error " }, 500)),
        RemoveLinkError: () => Effect.succeed(c.json({ message: "remove failed" }, 500)),
      }),
      Effect.withSpan("DELETE /.Link.controller"),
    )

    const result = await ServicesRuntime.runPromise(programs)
    return result
  })

  return app
}
