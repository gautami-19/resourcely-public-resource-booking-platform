import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2, CalendarClock, CheckCircle2, Clock3, IndianRupee, Users } from 'lucide-react'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'

const Stat = ({ icon: Icon, label, value, note }) => <div className="card p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div><div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Icon size={20}/></div></div></div>

export default function AdminOverview(){
 const [data,setData]=useState(null)
 const load=async()=>{const {data}=await api.get('/admin/dashboard');setData(data)}
 useEffect(()=>{load()},[])
 if(!data)return <div>Loading admin dashboard…</div>
 return <div>
  <div className="mb-7"><h1 className="text-3xl font-black">Admin overview</h1><p className="mt-1 text-slate-500">A complete view of your resources, customer requests and booking activity.</p></div>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
   <Stat icon={Building2} label="Total resources" value={data.stats.resources} note={`${data.stats.activeResources} active`} />
   <Stat icon={Clock3} label="Pending requests" value={data.stats.pending} note="Need admin review" />
   <Stat icon={CheckCircle2} label="Approved bookings" value={data.stats.approved} note="Currently approved" />
   <Stat icon={IndianRupee} label="Paid amount" value={`₹${Number(data.stats.amount||0).toLocaleString('en-IN')}`} note="Recorded payments" />
  </div>
  <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
   <div className="card p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">Resource utilization</h2><p className="text-sm text-slate-500">Pending + approved booking volume</p></div><Link className="text-sm font-bold text-indigo-600" to="/admin/reports">View reports</Link></div><div className="mt-5 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.utilization}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="bookings" fill="#4f46e5" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div>
   <div className="card overflow-hidden"><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold">Requests awaiting review</h2><p className="text-sm text-slate-500">Newest first</p></div><Link className="text-sm font-bold text-indigo-600" to="/admin/bookings">View all</Link></div><div className="divide-y">{data.pendingBookings.slice(0,6).map(b=><div className="p-4" key={b.id}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{b.resource.name}</p><p className="text-sm text-slate-500">{b.user.name}</p><p className="mt-1 text-xs text-slate-400">{new Date(b.startAt).toLocaleString()} – {new Date(b.endAt).toLocaleTimeString()}</p></div><StatusBadge value={b.status}/></div></div>)}{!data.pendingBookings.length&&<div className="p-6 text-sm text-slate-500">No pending requests.</div>}</div></div>
  </div>
  <div className="mt-6 grid gap-4 sm:grid-cols-3"><Link to="/admin/resources" className="card p-5 transition hover:-translate-y-0.5"><Building2 className="text-indigo-600"/><h3 className="mt-3 font-bold">Manage resources</h3><p className="mt-1 text-sm text-slate-500">Add multiple facilities, edit details and control availability.</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-600">Open <ArrowRight size={15}/></span></Link><Link to="/admin/bookings" className="card p-5 transition hover:-translate-y-0.5"><CalendarClock className="text-indigo-600"/><h3 className="mt-3 font-bold">Review bookings</h3><p className="mt-1 text-sm text-slate-500">Approve, reject, filter and inspect every booking.</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-600">Open <ArrowRight size={15}/></span></Link><Link to="/admin/users" className="card p-5 transition hover:-translate-y-0.5"><Users className="text-indigo-600"/><h3 className="mt-3 font-bold">Manage users</h3><p className="mt-1 text-sm text-slate-500">See registered users and their booking activity.</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-600">Open <ArrowRight size={15}/></span></Link></div>
 </div>
}
