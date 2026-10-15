import { useEffect, useState } from 'react'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'

export default function Bookings(){
 const [rows,setRows]=useState([]); const [loading,setLoading]=useState(true)
 async function load(){setLoading(true);const r=await api.get('/bookings/my');setRows(r.data.bookings);setLoading(false)}
 useEffect(()=>{load()},[])
 async function cancel(id){if(!confirm('Cancel this booking?'))return;try{await api.patch(`/bookings/${id}/cancel`);load()}catch(e){alert(e.response?.data?.message||'Unable to cancel')}}
 return <div><div className="mb-7"><h1 className="text-3xl font-black">My bookings</h1><p className="mt-1 text-slate-500">Track requests, approvals and payment records.</p></div><div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Resource</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Payment</th><th className="p-4"></th></tr></thead><tbody>{loading?<tr><td className="p-6" colSpan="5">Loading…</td></tr>:rows.map(b=><tr className="border-b last:border-0" key={b.id}><td className="p-4 font-semibold">{b.resource.name}</td><td className="p-4">{new Date(b.startAt).toLocaleString()}</td><td className="p-4"><StatusBadge value={b.status}/></td><td className="p-4">{b.payment?<StatusBadge value={b.payment.status}/>:<span className="text-slate-400">—</span>}</td><td className="p-4 text-right">{['PENDING','APPROVED'].includes(b.status)&&<button onClick={()=>cancel(b.id)} className="font-semibold text-rose-600">Cancel</button>}</td></tr>)}</tbody></table></div></div>
}
