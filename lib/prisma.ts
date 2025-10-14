import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClient
}

// 在开发环境中避免创建多个 Prisma Client 实例
const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

