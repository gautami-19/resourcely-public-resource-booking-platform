import { Router } from 'express'
import { prisma } from '../utils/prisma.js'
import { auth } from '../middleware/auth.js'

const router=Router()
router.use(auth)

router.get('/',async(req,res,next)=>{
 try{const notifications=await prisma.notification.findMany({where:{userId:req.user.id},orderBy:{createdAt:'desc'},take:50});res.json({notifications})}catch(e){next(e)}
})

router.patch('/:id/read',async(req,res,next)=>{
 try{const n=await prisma.notification.updateMany({where:{id:req.params.id,userId:req.user.id},data:{isRead:true}});res.json({notification:n})}catch(e){next(e)}
})

export default router
