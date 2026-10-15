import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma.js'
import { auth } from '../middleware/auth.js'
import { registerSchema, loginSchema } from '../utils/validation.js'

const router=Router()
const publicUser=u=>({id:u.id,name:u.name,email:u.email,phone:u.phone,role:u.role})

router.post('/register',async(req,res,next)=>{
 try{
  const data=registerSchema.parse(req.body)
  const normalizedEmail=data.email.toLowerCase()
  const exists=await prisma.user.findUnique({where:{email:normalizedEmail}})
  if(exists)return res.status(409).json({message:'Email is already registered',fieldErrors:{email:'Email is already registered'}})
  const user=await prisma.user.create({
   data:{name:data.name,email:normalizedEmail,passwordHash:await bcrypt.hash(data.password,10),phone:data.phone||null,role:data.role}
  })
  const token=jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:'7d'})
  res.status(201).json({token,user:publicUser(user)})
 }catch(e){next(e)}
})

router.post('/login',async(req,res,next)=>{
 try{
  const data=loginSchema.parse(req.body)
  const user=await prisma.user.findUnique({where:{email:data.email.toLowerCase()}})
  if(!user||!(await bcrypt.compare(data.password,user.passwordHash)))return res.status(401).json({message:'Invalid email or password',fieldErrors:{email:'Invalid email or password',password:'Invalid email or password'}})
  const token=jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:'7d'})
  res.json({token,user:publicUser(user)})
 }catch(e){next(e)}
})

router.get('/me',auth,async(req,res)=>res.json({user:req.user}))
export default router
