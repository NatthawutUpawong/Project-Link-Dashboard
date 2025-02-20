import { Layer, ManagedRuntime } from "effect"
import { LinkRepositoryContext } from "../repositories/links/index.js"
import PrismaClientContext from "../repositories/prisma.js"
import { ProjectRepositoryContext } from "../repositories/projects/index.js"
import { LinkServiceContext } from "../services/link/indext.js"
import { ProjectServiceContext } from "../services/project/indext.js"

const PrismaClientLive = PrismaClientContext.Live

const ProjectServiceLive = ProjectServiceContext.Live.pipe(
  Layer.provide(ProjectRepositoryContext.Live),
  Layer.provide(PrismaClientLive),
)

const LinkServiceLive = LinkServiceContext.Live.pipe(
  Layer.provide(LinkRepositoryContext.Live),
  Layer.provide(PrismaClientLive),
)

export const ServiceLive = Layer.mergeAll(
  ProjectServiceLive,
  LinkServiceLive
)

export const ServicesRuntime = ManagedRuntime.make(ServiceLive)
