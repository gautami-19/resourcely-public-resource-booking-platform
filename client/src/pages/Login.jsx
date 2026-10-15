import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function validate() {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    return next
  }

  async function submit(e) {
    e.preventDefault()
    const localErrors = validate()
    if (Object.keys(localErrors).length) return setErrors(localErrors)
    setErrors({}); setBusy(true)
    try {
      const user = await login(form.email.trim(), form.password)
      navigate(location.state?.from?.pathname || (user.role === 'ADMIN' ? '/admin' : '/dashboard'))
    } catch (err) {
      setErrors(err.response?.data?.fieldErrors || { form: err.response?.data?.message || 'Unable to sign in.' })
    } finally { setBusy(false) }
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to manage your resource bookings.">
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Email" type="email" value={form.email} error={errors.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <Field label="Password" type="password" value={form.password} error={errors.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      {errors.form && <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{errors.form}</p>}
      <button disabled={busy} className="btn-primary w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
      <p className="text-center text-sm text-slate-500">Don't have an account? <Link className="font-semibold text-indigo-600" to="/register">Create one</Link></p>
    </form>
  </AuthShell>
}

function Field({ label, error, ...props }) {
  return <label className="block"><span className="label">{label}</span><input className={`input ${error?'border-rose-400 focus:border-rose-500':''}`} required {...props}/>{error&&<span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}</label>
}

export function AuthShell({ title, subtitle, children }) {
  return <div className="grid min-h-screen md:grid-cols-2"><div className="hidden bg-slate-900 p-12 text-white md:flex md:flex-col md:justify-between"><div className="text-2xl font-black">ResourceBook</div><div><p className="mb-4 text-sm uppercase tracking-[.2em] text-indigo-300">Community infrastructure</p><h1 className="max-w-lg text-5xl font-black leading-tight">Book public resources without the paperwork.</h1><p className="mt-5 max-w-md text-slate-300">Discover facilities, check availability, submit booking requests and track approvals in one place.</p></div><p className="text-sm text-slate-500">Public Resource Booking Platform</p></div><div className="flex items-center justify-center p-6"><div className="w-full max-w-md"><div className="mb-8 text-2xl font-black md:hidden">Resource<span className="text-indigo-600">Book</span></div><h2 className="text-3xl font-black">{title}</h2><p className="mt-2 mb-8 text-slate-500">{subtitle}</p>{children}</div></div></div>
}
