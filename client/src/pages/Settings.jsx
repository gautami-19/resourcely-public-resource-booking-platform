import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Settings(){
 const {user}=useAuth(); const [saved,setSaved]=useState(false)
 return <div className="max-w-2xl"><div className="mb-7"><h1 className="text-3xl font-black">Settings</h1><p className="mt-1 text-slate-500">Manage your account information.</p></div><div className="card p-6"><div className="grid gap-4 sm:grid-cols-2"><label><span className="label">Name</span><input className="input" defaultValue={user?.name}/></label><label><span className="label">Email</span><input className="input" defaultValue={user?.email} disabled/></label><label><span className="label">Phone</span><input className="input" defaultValue={user?.phone||''}/></label><label><span className="label">Role</span><input className="input" defaultValue={user?.role} disabled/></label></div><button onClick={()=>setSaved(true)} className="btn-primary mt-6">Save changes</button>{saved&&<p className="mt-3 text-sm text-emerald-600">Profile UI is ready; server-side profile editing can be enabled through the profile endpoint.</p>}</div></div>
}
