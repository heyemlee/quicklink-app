import { PrismaClient } from '@prisma/client'

const globalForPrisma = global

// 在开发环境中避免创建多个 Prisma Client 实例
const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

