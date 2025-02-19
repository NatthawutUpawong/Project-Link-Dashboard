import { config } from "@dotenvx/dotenvx"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { setupOpenApi } from "./configure/setup-openapi.js"
import { setupScalarDocs } from "./configure/setup-scalar-docs.js"
import healthzApp from "./controllers/healthz.js"
import * as LinkControllers from "./controllers/links/index.js"
import * as ProjectControllers from "./controllers/projects/index.js"

config()

const app = new Hono()
setupOpenApi(app)

app.get("/", (c) => {
  return c.text("Hello Hono!")
})

app.route("/docs", setupScalarDocs())
app.route("/healthz", healthzApp)

app.route("project", ProjectControllers.setupProjectRoutes())
app.route("link", LinkControllers.setupLinkRoutes())

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
