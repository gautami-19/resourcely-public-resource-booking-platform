import { Router } from 'express'
import { prisma } from '../utils/prisma.js'
import { auth, admin } from '../middleware/auth.js'
import { sendBookingDecisionEmail } from '../utils/email.js'

const router=Router()
router.use(auth,admin)

const ownerResourceWhere=(userId)=>({ownerId:userId})

function monthKey(date){const d=new Date(date);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
function monthSeries(){const result=[];for(let i=11;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);result.push({key:monthKey(d),month:d.toLocaleString('en',{month:'short'}),bookings:0,revenue:0})}return result}

router.get('/dashboard',async(req,res,next)=>{
 try{
  const resourceWhere=ownerResourceWhere(req.user.id)
  const [resources,activeResources,pending,approved,paid,pendingBookings,allBookings,allPayments,resourceRows]=await Promise.all([
   prisma.resource.count({where:resourceWhere}),
   prisma.resource.count({where:{...resourceWhere,status:'ACTIVE'}}),
   prisma.booking.count({where:{status:'PENDING',resource:resourceWhere}}),
   prisma.booking.count({where:{status:'APPROVED',resource:resourceWhere}}),
   prisma.payment.aggregate({where:{status:'PAID',booking:{resource:resourceWhere}},_sum:{amount:true}}),
   prisma.booking.findMany({where:{status:'PENDING',resource:resourceWhere},include:{user:{select:{name:true,email:true}},resource:true},orderBy:{createdAt:'asc'},take:20}),
   prisma.booking.findMany({where:{resource:resourceWhere},select:{resourceId:true,status:true,createdAt:true,startAt:true,endAt:true,resource:{select:{name:true}}}}),
   prisma.payment.findMany({where:{status:'PAID',booking:{resource:resourceWhere}},select:{amount:true,createdAt:true}}),
   prisma.resource.findMany({where:resourceWhere,select:{id:true,name:true}})
  ])
  const counts=await prisma.booking.groupBy({by:['resourceId'],where:{resource:resourceWhere,status:{in:['APPROVED','PENDING']}},_count:{_all:true}})
  const map=new Map(counts.map(x=>[x.resourceId,x._count._all]))
  const monthly=monthSeries()
  const monthlyMap=new Map(monthly.map(x=>[x.key,x]))
  for(const b of allBookings){const m=monthlyMap.get(monthKey(b.createdAt));if(m)m.bookings++}
  for(const p of allPayments){const m=monthlyMap.get(monthKey(p.createdAt));if(m)m.revenue+=Number(p.amount)}
  const statusCounts=['PENDING','APPROVED','REJECTED','CANCELLED'].map(status=>({status,count:allBookings.filter(b=>b.status===status).length}))
  res.json({stats:{resources,activeResources,pending,approved,amount:paid._sum.amount||0},pendingBookings,utilization:resourceRows.map(r=>({name:r.name,bookings:map.get(r.id)||0})),monthly,statusCounts})
 }catch(e){next(e)}
})

router.get('/resources',async(req,res,next)=>{
 try{const resources=await prisma.resource.findMany({where:ownerResourceWhere(req.user.id),orderBy:{createdAt:'desc'}});res.json({resources})}catch(e){next(e)}
})

router.get('/users',async(req,res,next)=>{
 try{
  const users=await prisma.user.findMany({where:{bookings:{some:{resource:ownerResourceWhere(req.user.id)}}},select:{id:true,name:true,email:true,phone:true,role:true,createdAt:true,_count:{select:{bookings:true}}},orderBy:{createdAt:'desc'}})
  res.json({users})
 }catch(e){next(e)}
})

router.get('/payments',async(req,res,next)=>{
 try{const payments=await prisma.payment.findMany({where:{booking:{resource:ownerResourceWhere(req.user.id)}},include:{booking:{include:{user:{select:{name:true,email:true}},resource:{select:{name:true}}}}},orderBy:{createdAt:'desc'}});res.json({payments})}catch(e){next(e)}
})

router.get('/bookings',async(req,res,next)=>{
 try{const bookings=await prisma.booking.findMany({where:{resource:ownerResourceWhere(req.user.id)},include:{user:{select:{name:true,email:true}},resource:true,payment:true},orderBy:{createdAt:'desc'}});res.json({bookings})}catch(e){next(e)}
})

router.patch('/bookings/:id/approve',async(req,res,next)=>{
 try{
  const booking=await prisma.booking.findFirst({where:{id:req.params.id,resource:ownerResourceWhere(req.user.id)},include:{resource:true,user:true,payment:true}})
  if(!booking)return res.status(404).json({message:'Booking not found in your resources'})
  if(booking.status!=='PENDING')return res.status(400).json({message:'Only pending bookings can be approved'})
  const clash=await prisma.booking.findFirst({where:{id:{not:booking.id},resourceId:booking.resourceId,status:'APPROVED',startAt:{lt:booking.endAt},endAt:{gt:booking.startAt}}})
  if(clash)return res.status(409).json({message:'An approved booking now occupies this time'})
  const updated=await prisma.booking.update({where:{id:booking.id},data:{status:'APPROVED'}})
  await prisma.notification.create({data:{userId:booking.userId,bookingId:booking.id,message:`Your booking for ${booking.resource.name} has been approved.`}})
  try{await sendBookingDecisionEmail({customer:booking.user,resource:booking.resource,booking:{...booking,status:'APPROVED'},decision:'APPROVED'})}catch(emailError){console.error('[email] Approval notification failed:',emailError.message)}
  res.json({booking:updated})
 }catch(e){next(e)}
})

router.patch('/bookings/:id/reject',async(req,res,next)=>{
 try{
  const booking=await prisma.booking.findFirst({where:{id:req.params.id,resource:ownerResourceWhere(req.user.id)},include:{resource:true,user:true}})
  if(!booking)return res.status(404).json({message:'Booking not found in your resources'})
  if(booking.status!=='PENDING')return res.status(400).json({message:'Only pending bookings can be rejected'})
  const updated=await prisma.booking.update({where:{id:booking.id},data:{status:'REJECTED',rejectionReason:req.body.reason||'Request rejected'}})
  await prisma.notification.create({data:{userId:booking.userId,bookingId:booking.id,message:`Your booking for ${booking.resource.name} was rejected: ${updated.rejectionReason}`}})
  try{await sendBookingDecisionEmail({customer:booking.user,resource:booking.resource,booking:updated,decision:'REJECTED'})}catch(emailError){console.error('[email] Rejection notification failed:',emailError.message)}
  res.json({booking:updated})
 }catch(e){next(e)}
})

router.patch('/payments/:id/status',async(req,res,next)=>{
 try{
  const {status,transactionRef}=req.body
  const existing=await prisma.payment.findFirst({where:{id:req.params.id,booking:{resource:ownerResourceWhere(req.user.id)}}})
  if(!existing)return res.status(404).json({message:'Payment not found in your resources'})
  const payment=await prisma.payment.update({where:{id:req.params.id},data:{status,transactionRef,paidAt:status==='PAID'?new Date():null}})
  res.json({payment})
 }catch(e){next(e)}
})

export default router
