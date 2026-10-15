import { Router } from 'express'
import { prisma } from '../utils/prisma.js'
import { auth } from '../middleware/auth.js'
import { bookingSchema } from '../utils/validation.js'
import { sendBookingCreatedEmail } from '../utils/email.js'

const router=Router()

async function conflict(resourceId,startAt,endAt,excludeId=null){
 return prisma.booking.findFirst({where:{resourceId,id:excludeId?{not:excludeId}:undefined,status:{in:['PENDING','APPROVED']},startAt:{lt:endAt},endAt:{gt:startAt}}})
}

router.post('/',auth,async(req,res,next)=>{
 try{
  const data=bookingSchema.parse(req.body)
  const start=new Date(data.startAt), end=new Date(data.endAt)
  const now=new Date()
  if(start < now)return res.status(400).json({message:'You cannot book a date or time that has already passed.',fieldErrors:{startAt:'Select a future date and time.'}})
  if(end<=start)return res.status(400).json({message:'End time must be after start time.',fieldErrors:{endAt:'End time must be after start time.'}})
  const resource=await prisma.resource.findUnique({where:{id:data.resourceId},include:{owner:{select:{id:true,name:true,email:true}}}})
  if(!resource||resource.status!=='ACTIVE')return res.status(400).json({message:'Resource is unavailable'})
  if(!resource.owner)return res.status(400).json({message:'This resource is not currently assigned to a resource provider'})
  if(data.attendees>resource.capacity)return res.status(400).json({message:`Maximum capacity is ${resource.capacity}`,fieldErrors:{attendees:`Maximum capacity is ${resource.capacity}`}})
  if(await conflict(resource.id,start,end))return res.status(409).json({message:'The selected time overlaps an existing booking',fieldErrors:{startAt:'This time slot is already requested or booked.'}})
  const hours=(end-start)/3600000
  const booking=await prisma.booking.create({data:{userId:req.user.id,resourceId:resource.id,startAt:start,endAt:end,purpose:data.purpose,attendees:data.attendees,payment:{create:{amount:Number(resource.pricePerHour)*hours}}},include:{resource:true,payment:true,user:{select:{name:true,email:true}}}})
  await prisma.notification.create({data:{userId:req.user.id,bookingId:booking.id,message:`Your request for ${resource.name} has been submitted for review.`}})
  try{await sendBookingCreatedEmail({provider:resource.owner,customer:booking.user,resource,booking})}catch(emailError){console.error('[email] Booking notification failed:',emailError.message)}
  res.status(201).json({booking})
 }catch(e){next(e)}
})

router.get('/my',auth,async(req,res,next)=>{
 try{const bookings=await prisma.booking.findMany({where:{userId:req.user.id},include:{resource:true,payment:true},orderBy:{startAt:'desc'}});res.json({bookings})}catch(e){next(e)}
})

router.get('/dashboard',auth,async(req,res,next)=>{
 try{
  const [all,pending,approved,payments,recent]=await Promise.all([
   prisma.booking.count({where:{userId:req.user.id}}),
   prisma.booking.count({where:{userId:req.user.id,status:'PENDING'}}),
   prisma.booking.count({where:{userId:req.user.id,status:'APPROVED'}}),
   prisma.payment.aggregate({where:{booking:{userId:req.user.id}},_sum:{amount:true}}),
   prisma.booking.findMany({where:{userId:req.user.id},include:{resource:true},orderBy:{createdAt:'desc'},take:5})
  ])
  const months=[]
  for(let i=11;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i,1);d.setHours(0,0,0,0);months.push({key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,month:d.toLocaleString('en',{month:'short'}),bookings:0})}
  const chartBookings=await prisma.booking.findMany({where:{userId:req.user.id},select:{createdAt:true}})
  for(const b of chartBookings){const d=new Date(b.createdAt);const item=months.find(x=>x.key===`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);if(item)item.bookings++}
  res.json({stats:{totalBookings:all,pending,approved,amount:payments._sum.amount||0},bookings:recent,chart:months})
 }catch(e){next(e)}
})

router.patch('/:id/cancel',auth,async(req,res,next)=>{
 try{
  const booking=await prisma.booking.findUnique({where:{id:req.params.id},include:{resource:true}})
  if(!booking||booking.userId!==req.user.id)return res.status(404).json({message:'Booking not found'})
  if(!['PENDING','APPROVED'].includes(booking.status))return res.status(400).json({message:'This booking cannot be cancelled'})
  const updated=await prisma.booking.update({where:{id:booking.id},data:{status:'CANCELLED'}})
  await prisma.notification.create({data:{userId:req.user.id,bookingId:booking.id,message:`Your booking for ${booking.resource.name} was cancelled.`}})
  res.json({booking:updated})
 }catch(e){next(e)}
})

export default router
