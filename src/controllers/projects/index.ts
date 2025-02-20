import { Hono } from "hono"
import * as ProjectDeleteRoutes from "./delete.js"
import * as ProjectGetRoutes from "./get.js"
import * as ProjectPostRoutes from "./post.js"
import * as ProjectPutRoutes from "./put.js"

export function setupProjectRoutes() {
  const app = new Hono()

  app.route("/", ProjectPostRoutes.setupProjectPostRoutes())

  app.route("/", ProjectGetRoutes.setupProjectGetRoutes())

  app.route("/", ProjectPutRoutes.setupProjectPutRoutes())

  app.route("/", ProjectDeleteRoutes.setupProjectDeleteRoutes())

  return app
}
