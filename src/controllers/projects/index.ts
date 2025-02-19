import { Hono } from "hono"
// import * as EmployeeDeleteRoutes from "./delete.js"
import * as ProjectGetRoutes from "./get.js"
import * as ProjectPostRoutes from "./post.js"
// import * as EmployeePutRoutes from "./put.js"

export function setupProjectRoutes() {
  const app = new Hono()

  app.route("/", ProjectPostRoutes.setupProjectPostRoutes())

  app.route("/", ProjectGetRoutes.setupProjectGetRoutes())

  // app.route("/", EmployeePutRoutes.setupEmployeePutRoutes())

  // app.route("/", EmployeeDeleteRoutes.setupRoutes())

  return app
}
