/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始种子数据...')

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 12)

  const user = await prisma.user.upsert({
    where: { email: 'test@gmail.com' },
    update: {},
    create: {
      email: 'test@gmail.com',
      password: hashedPassword,
      slug: 'test-demo',
      emailVerified: true,
      profile: {
        create: {
          companyName: 'KABi Design',
          companySubtitle: 'Kitchen and Bath Institute',
          logoUrl: '/icons/kabi.png',
          phone: '(669) 298-1888',
          address: '1754 Junction Ave, San Jose',
          email: 'contact@kabidesign.com',
          
          // 社交媒体
          wechatId: 'KABI-Design',
          instagram: 'kabidesign',
          facebook: 'https://facebook.com/kabidesign',
          tiktok: 'https://tiktok.com/@kabidesign',
          
          // 评价链接
          googleReviewUrl: 'https://g.page/kabidesign/review',
          yelpReviewUrl: 'https://yelp.com/writeareview/biz/kabidesign',
          
          // 配色
          primaryColor: '#7c3aed',
          secondaryColor: '#ec4899',
          accentColor: '#3b82f6',
          
          // 显示设置
          showContact: true,
          showFollow: true,
          showReview: true,
          
          // 平台设置
          followPlatforms: JSON.stringify(['website', 'instagram', 'facebook', 'wechat', 'tiktok']),
          reviewPlatforms: JSON.stringify(['googlemap', 'yelp', 'xiaohongshu', 'instagram']),
        }
      }
    },
    include: {
      profile: true
    }
  })

  console.log('✅ 测试用户创建成功')
  console.log('📧 邮箱: test@gmail.com')
  console.log('🔑 密码: 123456')
  console.log('🔗 名片链接: http://localhost:3000/card/test-demo')
  console.log('')
  console.log('用户 ID:', user.id)
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

