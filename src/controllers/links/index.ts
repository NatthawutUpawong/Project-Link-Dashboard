import { Hono } from "hono"
import * as LinkDeleteRoutes from "./delete.js"
import * as LinkGetRoutes from "./get.js"
import * as LinkPostRoutes from "./post.js"
import * as LinkPutRoutes from "./put.js"

export function setupLinkRoutes() {
  const app = new Hono()

  app.route("/", LinkPostRoutes.setupLinkPostRoutes())

  app.route("/", LinkGetRoutes.setupLinkGetRoutes())

  app.route("/", LinkPutRoutes.setupLinkPutRoutes())

  app.route("/", LinkDeleteRoutes.setupLinkDeleteRoutes())

  return app
}
