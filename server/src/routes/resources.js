import { Router } from 'express'
import { prisma } from '../utils/prisma.js'
import { auth, admin } from '../middleware/auth.js'

const router=Router()

router.get('/',async(req,res,next)=>{
 try{
  const {q,type}=req.query
  const resources=await prisma.resource.findMany({where:{status:{not:'INACTIVE'},...(type&&type!=='ALL'?{type}:{}),...(q?{OR:[{name:{contains:q,mode:'insensitive'}},{location:{contains:q,mode:'insensitive'}}]}:{})},include:{owner:{select:{id:true,name:true}}},orderBy:{name:'asc'}})
  res.json({resources})
 }catch(e){next(e)}
})

router.get('/:id',async(req,res,next)=>{
 try{
  const resource=await prisma.resource.findUnique({where:{id:req.params.id},include:{owner:{select:{id:true,name:true}}}})
  if(!resource)return res.status(404).json({message:'Resource not found'})
  const bookings=await prisma.booking.findMany({where:{resourceId:req.params.id,status:{in:['PENDING','APPROVED']}},select:{id:true,startAt:true,endAt:true,status:true}})
  res.json({resource,bookings})
 }catch(e){next(e)}
})

router.post('/',auth,admin,async(req,res,next)=>{
 try{
  const resource=await prisma.resource.create({data:{...req.body,ownerId:req.user.id}})
  res.status(201).json({resource})
 }catch(e){next(e)}
})

router.put('/:id',auth,admin,async(req,res,next)=>{
 try{
  const existing=await prisma.resource.findFirst({where:{id:req.params.id,ownerId:req.user.id}})
  if(!existing)return res.status(404).json({message:'Resource not found in your account'})
  const {ownerId,...safeData}=req.body
  const resource=await prisma.resource.update({where:{id:req.params.id},data:safeData})
  res.json({resource})
 }catch(e){next(e)}
})

router.delete('/:id',auth,admin,async(req,res,next)=>{
 try{
  const existing=await prisma.resource.findFirst({where:{id:req.params.id,ownerId:req.user.id}})
  if(!existing)return res.status(404).json({message:'Resource not found in your account'})
  const count=await prisma.booking.count({where:{resourceId:req.params.id,status:{in:['PENDING','APPROVED']}}})
  if(count)return res.status(409).json({message:'Cannot delete a resource with pending or approved bookings. Disable it instead.'})
  await prisma.resource.delete({where:{id:req.params.id}})
  res.json({message:'Resource deleted'})
 }catch(e){next(e)}
})

export default router
