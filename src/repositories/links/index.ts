import type { PrismaClient } from "@prisma/client"
import type * as Types from "../../types/repositories/link.js"
import { Context, Effect, Layer } from "effect"
import PrismaClientContext from "../prisma.js"
import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"

function initLinkRepository(prismaClient: PrismaClient): Types.LinkRepository {
  return {
    create: Creates.create(prismaClient),
    findById: Finds.findById(prismaClient),
    findByIdWithRelations: Finds.findByIdWithRelations(prismaClient),
    findMany: Finds.findMany(prismaClient),
    findManyWithRelations: Finds.findManyWithRelations(prismaClient),
    hardRemove: Removes.hardRemoveById(prismaClient),
    remove: Removes.remove(prismaClient), 
    update: Updates.update(prismaClient),
    updatePartial: Updates.updatePartial(prismaClient),
  }
}

export class LinkRepositoryContext extends Context.Tag("repository/Link")<LinkRepositoryContext, Types.LinkRepository>() {
  // method Live ที่จะใช้สร้าง Context EmployeeRepositoryContext จะสร้างผ่าน Layer.effect(<class name>, <Effect value>) รับ parameters 2 ตัว
  static Live = Layer.effect(this, Effect.gen(function* () {
    const prismaClient = yield * PrismaClientContext
    return initLinkRepository(prismaClient)
  }))
}
