import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from './Login'
import { useAuth } from '../context/AuthContext'

const initial={name:'',email:'',phone:'',password:'',role:'USER'}

export default function Register() {
  const { register } = useAuth(); const navigate=useNavigate(); const [form,setForm]=useState(initial); const [errors,setErrors]=useState({}); const [busy,setBusy]=useState(false)
  function validate(){
    const e={}
    if(form.name.trim().length<2)e.name='Name must be at least 2 characters.'
    if(!/^\S+@\S+\.\S+$/.test(form.email.trim()))e.email='Enter a valid email address.'
    if(form.phone && !/^\+?[0-9]{10,15}$/.test(form.phone.trim()))e.phone='Enter a valid phone number (10–15 digits).'
    if(form.password.length<8)e.password='Password must be at least 8 characters.'
    else {if(!/[A-Z]/.test(form.password))e.password='Password needs an uppercase letter, lowercase letter and number.';else if(!/[a-z]/.test(form.password))e.password='Password needs an uppercase letter, lowercase letter and number.';else if(!/[0-9]/.test(form.password))e.password='Password needs an uppercase letter, lowercase letter and number.'}
    return e
  }
  async function submit(e){e.preventDefault();const local=validate();if(Object.keys(local).length)return setErrors(local);setErrors({});setBusy(true);try{const user=await register({...form,name:form.name.trim(),email:form.email.trim(),phone:form.phone.trim()});navigate(user.role==='ADMIN'?'/admin':'/dashboard')}catch(err){setErrors(err.response?.data?.fieldErrors||{form:err.response?.data?.message||'Registration failed.'})}finally{setBusy(false)}}
  return <AuthShell title="Create your account" subtitle="Choose whether you want to book resources or provide them."><form onSubmit={submit} className="space-y-4" noValidate>
    <label className="block"><span className="label">Account type</span><select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="USER">Customer — I want to book resources</option><option value="ADMIN">Resource Provider — I want to list resources</option></select></label>
    <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800">{form.role==='USER'?'Customers can discover resources from all providers and submit booking requests.':'Resource providers can publish multiple resources and approve or reject requests for their own resources.'}</div>
    <Field label="Full name / Provider name" value={form.name} error={errors.name} onChange={e=>setForm({...form,name:e.target.value})}/>
    <Field label="Email" type="email" value={form.email} error={errors.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    <Field label="Phone (optional)" value={form.phone} error={errors.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
    <Field label="Password" type="password" value={form.password} error={errors.password} onChange={e=>setForm({...form,password:e.target.value})}/>
    <p className="text-xs text-slate-500">Password: at least 8 characters, including uppercase, lowercase and a number.</p>
    {errors.form&&<p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{errors.form}</p>}
    <button disabled={busy} className="btn-primary w-full">{busy?'Creating…':form.role==='ADMIN'?'Create provider account':'Create customer account'}</button>
    <p className="text-center text-sm text-slate-500">Already registered? <Link className="font-semibold text-indigo-600" to="/login">Sign in</Link></p>
  </form></AuthShell>
}
function Field({label,error,...props}){return <label className="block"><span className="label">{label}</span><input className={`input ${error?'border-rose-400 focus:border-rose-500':''}`} required={!label.includes('optional')} {...props}/>{error&&<span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}</label>}
