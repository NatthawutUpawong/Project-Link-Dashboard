import type { ProjectRepository } from "../repositories/project.js"

export type ProjectService = {
  create: ProjectRepository["create"]
  findOneById: ProjectRepository["findByIdWithRelations"]
  findMany: ProjectRepository["findManyWithRelations"]
  update: ProjectRepository["update"]
  removeById: ProjectRepository["remove"]
}
