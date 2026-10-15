import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Notifications(){
 const [rows,setRows]=useState([])
 async function load(){const r=await api.get('/notifications');setRows(r.data.notifications)}
 useEffect(()=>{load()},[])
 async function read(id){await api.patch(`/notifications/${id}/read`);load()}
 return <div><div className="mb-7"><h1 className="text-3xl font-black">Notifications</h1><p className="mt-1 text-slate-500">Updates about your booking activity.</p></div><div className="space-y-3">{rows.map(n=><div key={n.id} className={`card flex items-start justify-between gap-4 p-5 ${!n.isRead?'border-indigo-200 bg-indigo-50/30':''}`}><div><p className="font-semibold">{n.message}</p><p className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p></div>{!n.isRead&&<button onClick={()=>read(n.id)} className="text-xs font-bold text-indigo-600">Mark read</button>}</div>)}{!rows.length&&<div className="card p-8 text-center text-slate-500">No notifications.</div>}</div></div>
}
