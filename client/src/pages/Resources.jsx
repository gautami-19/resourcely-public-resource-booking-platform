import { useEffect, useState } from 'react'
import api from '../services/api'
import ResourceCard from '../components/ResourceCard'

export default function Resources(){
 const [resources,setResources]=useState([]); const [q,setQ]=useState(''); const [type,setType]=useState('ALL')
 useEffect(()=>{api.get('/resources').then(r=>setResources(r.data.resources))},[])
 const filtered=resources.filter(r=>(type==='ALL'||r.type===type)&&(r.name.toLowerCase().includes(q.toLowerCase())||r.location.toLowerCase().includes(q.toLowerCase())))
 const types=['ALL',...new Set(resources.map(r=>r.type))]
 return <div><div className="mb-7"><h1 className="text-3xl font-black">Resources</h1><p className="mt-1 text-slate-500">Find a facility that fits your needs.</p></div>
 <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_180px]"><input className="input" placeholder="Search by name or location…" value={q} onChange={e=>setQ(e.target.value)}/><select className="input" value={type} onChange={e=>setType(e.target.value)}>{types.map(t=><option key={t}>{t}</option>)}</select></div>
 <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(r=><ResourceCard resource={r} key={r.id}/>)}</div></div>
}
