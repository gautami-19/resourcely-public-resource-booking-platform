import { useEffect, useState } from 'react'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts'
import api from '../services/api'

const palette=['#4f46e5','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#f97316']

export default function AdminReports(){
 const [data,setData]=useState(null)
 useEffect(()=>{api.get('/admin/dashboard').then(({data})=>setData(data))},[])
 if(!data)return <div>Loading reports…</div>
 return <div><div className="mb-7"><h1 className="text-3xl font-black">Reports & analytics</h1><p className="mt-1 text-slate-500">Understand booking demand, resource performance, status mix and recorded revenue.</p></div>
  <div className="grid gap-6 xl:grid-cols-2">
   <ChartCard title="Monthly bookings" subtitle="Booking requests created during the last 12 months"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.monthly}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="bookings" fill="#4f46e5" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></ChartCard>
   <ChartCard title="Monthly recorded revenue" subtitle="Paid payment records by month"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.monthly}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip formatter={(v)=>`₹${Number(v).toLocaleString('en-IN')}`}/><Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r:3}}/></LineChart></ResponsiveContainer></ChartCard>
   <ChartCard title="Bookings by resource" subtitle="Pending + approved booking volume"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.utilization} layout="vertical"><CartesianGrid strokeDasharray="3 3"/><XAxis type="number" allowDecimals={false}/><YAxis type="category" dataKey="name" width={110}/><Tooltip/><Bar dataKey="bookings" fill="#0ea5e9" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></ChartCard>
   <ChartCard title="Booking status distribution" subtitle="All booking requests for your resources"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.statusCounts} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={105} label>{data.statusCounts.map((entry,index)=><Cell key={entry.status} fill={palette[index%palette.length]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></ChartCard>
  </div>
  <div className="card mt-6 p-6"><h2 className="font-bold">Booking trend</h2><p className="text-sm text-slate-500">A quick view of demand over the last year.</p><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.monthly}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis allowDecimals={false}/><Tooltip/><Area type="monotone" dataKey="bookings" stroke="#8b5cf6" fill="#ede9fe" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></div>
 </div>
}
function ChartCard({title,subtitle,children}){return <div className="card p-6"><h2 className="font-bold">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p><div className="mt-5 h-[360px]">{children}</div></div>}
