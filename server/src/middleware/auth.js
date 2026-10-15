import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma.js'

export async function auth(req,res,next){
  const header=req.headers.authorization
  if(!header?.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'})
  try{
    const payload=jwt.verify(header.slice(7),process.env.JWT_SECRET)
    req.user=await prisma.user.findUnique({where:{id:payload.userId},select:{id:true,name:true,email:true,phone:true,role:true}})
    if(!req.user) return res.status(401).json({message:'User not found'})
    next()
  }catch{return res.status(401).json({message:'Invalid or expired token'})}
}

export function admin(req,res,next){
  if(req.user?.role!=='ADMIN') return res.status(403).json({message:'Administrator access required'})
  next()
}
