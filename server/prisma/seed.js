import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const userPassword = await bcrypt.hash('User@123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@resourcebook.local' },
    update: { role:'ADMIN', name:'Demo Resource Provider' },
    create: { name: 'Demo Resource Provider', email: 'admin@resourcebook.local', passwordHash: adminPassword, role: 'ADMIN', phone: '9999999999' }
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@resourcebook.local' },
    update: { role:'USER', name:'Demo Customer' },
    create: { name: 'Demo Customer', email: 'user@resourcebook.local', passwordHash: userPassword, role: 'USER', phone: '8888888888' }
  })

  const resources = [
    ['Central Community Hall','COMMUNITY_HALL','Large multipurpose hall for community events, workshops and celebrations.','Pimpri Community Centre',250,2000,'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'],
    ['City Sports Ground','SPORTS_GROUND','Open sports ground suitable for football, cricket practice and community sports.','Pimpri Sports Complex',500,1200,'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'],
    ['Computer Lab A','LAB','Computer laboratory for workshops, training sessions and academic activities.','Technology Centre',60,900,'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'],
    ['Civic Meeting Room','MEETING_ROOM','Quiet meeting room equipped with display and conference seating.','Municipal Office',20,500,'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80'],
    ['Public Auditorium','AUDITORIUM','Auditorium for talks, seminars, performances and public events.','Civic Cultural Centre',400,3500,'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80']
  ]
  for (const r of resources) {
    await prisma.resource.upsert({
      where: { id: `seed-${r[0].toLowerCase().replace(/[^a-z]+/g,'-')}` },
      update: { ownerId:admin.id },
      create: { id:`seed-${r[0].toLowerCase().replace(/[^a-z]+/g,'-')}`, name:r[0], type:r[1], description:r[2], location:r[3], capacity:r[4], pricePerHour:r[5], imageUrl:r[6], ownerId:admin.id }
    })
  }

  const hall = await prisma.resource.findFirst({ where:{ name:'Central Community Hall', ownerId:admin.id } })
  const existing = hall ? await prisma.booking.findFirst({ where:{ userId:user.id, resourceId:hall.id } }) : null
  if (hall && !existing) {
    const start = new Date(); start.setDate(start.getDate()+3); start.setHours(10,0,0,0)
    const end = new Date(start); end.setHours(13,0,0,0)
    const booking = await prisma.booking.create({ data:{ userId:user.id, resourceId:hall.id, startAt:start, endAt:end, purpose:'Community workshop', attendees:80, status:'PENDING' }})
    await prisma.payment.create({ data:{ bookingId:booking.id, amount:6000, status:'UNPAID' }})
    await prisma.notification.create({ data:{ userId:user.id, bookingId:booking.id, message:'Your community hall booking request is pending resource-provider review.' }})
  }

  console.log('Seed complete.')
  console.log('Provider:', admin.email, 'Admin@123')
  console.log('Customer:', user.email, 'User@123')
}

main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
