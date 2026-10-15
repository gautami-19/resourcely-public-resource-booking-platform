import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import resourceRoutes from './routes/resources.js'
import bookingRoutes from './routes/bookings.js'
import adminRoutes from './routes/admin.js'
import notificationRoutes from './routes/notifications.js'
import paymentRoutes from './routes/payments.js'

const app=express()
const port=process.env.PORT||5000
const allowedOrigins=(process.env.CLIENT_URL||'http://localhost:5173').split(',').map(x=>x.trim()).filter(Boolean)
app.use(cors({origin:(origin,callback)=>{if(!origin||allowedOrigins.includes(origin))return callback(null,true);callback(new Error('Origin not allowed by CORS'))}}))
app.use(express.json())

app.get('/api/health',(req,res)=>res.json({status:'ok',service:'resource-booking-api'}))
app.use('/api/auth',authRoutes)
app.use('/api/resources',resourceRoutes)
app.use('/api/bookings',bookingRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/notifications',notificationRoutes)
app.use('/api/payments',paymentRoutes)

app.use((err,req,res,next)=>{
 console.error(err)
 if(err.name==='ZodError'){const fieldErrors={};for(const issue of err.issues){const key=issue.path?.[0];if(key&&!fieldErrors[key])fieldErrors[key]=issue.message}return res.status(400).json({message:'Please correct the highlighted fields.',fieldErrors,errors:err.issues})}
 if(err.code==='P2002')return res.status(409).json({message:'A record with this value already exists'})
 if(err.code==='P2025')return res.status(404).json({message:'Record not found'})
 res.status(500).json({message:'Internal server error'})
})

app.listen(port,()=>console.log(`API running on http://localhost:${port}`))
