import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Clock3, Search, WalletCards } from 'lucide-react'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const [data,setData]=useState({stats:{},bookings:[],chart:[]})
  useEffect(()=>{api.get('/bookings/dashboard').then(r=>setData(r.data)).catch(()=>{})},[])
  const cards=[['Total bookings',data.stats.totalBookings||0,CalendarCheck],['Pending requests',data.stats.pending||0,Clock3],['Approved',data.stats.approved||0,Search],['Amount recorded',`₹${Number(data.stats.amount||0).toLocaleString('en-IN')}`,WalletCards]]
  return <div>
    <div className="mb-8"><h1 className="text-3xl font-black">Good to see you.</h1><p className="mt-1 text-slate-500">Here’s an overview of your resource activity.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value,Icon])=><div className="card p-5" key={label}><Icon className="mb-5 text-indigo-600"/><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}</div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="card p-5 lg:col-span-2"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Booking activity</h2><p className="text-sm text-slate-500">Last six months</p></div><Link to="/resources" className="btn-secondary">Browse resources</Link></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="bookings" fill="#4f46e5" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div>
      <div className="card p-5"><h2 className="font-bold">Recent bookings</h2><div className="mt-4 space-y-3">{data.bookings.length?data.bookings.map(b=><div className="rounded-xl bg-slate-50 p-3" key={b.id}><div className="flex justify-between gap-2"><span className="font-semibold">{b.resource.name}</span><StatusBadge value={b.status}/></div><p className="mt-1 text-xs text-slate-500">{new Date(b.startAt).toLocaleString()}</p></div>):<p className="text-sm text-slate-500">No bookings yet.</p>}</div></div>
    </div>
  </div>
}
