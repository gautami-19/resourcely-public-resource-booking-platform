import { Router } from 'express'
import { prisma } from '../utils/prisma.js'
import { auth, admin } from '../middleware/auth.js'

const router=Router()
router.get('/',auth,async(req,res,next)=>{
 try{
  const where=req.user.role==='ADMIN'?{}:{booking:{userId:req.user.id}}
  const payments=await prisma.payment.findMany({where,include:{booking:{include:{resource:true}}},orderBy:{createdAt:'desc'}})
  res.json({payments})
 }catch(e){next(e)}
})
export default router
