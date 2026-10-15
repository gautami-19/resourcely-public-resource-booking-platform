import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
import ResourceDetails from './pages/ResourceDetails'
import Bookings from './pages/Bookings'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import AdminOverview from './pages/AdminOverview'
import AdminBookings from './pages/AdminBookings'
import AdminResources from './pages/AdminResources'
import AdminUsers from './pages/AdminUsers'
import AdminPayments from './pages/AdminPayments'
import AdminReports from './pages/AdminReports'

function Landing(){
 return <div className="min-h-screen bg-slate-950 text-white"><nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6"><div className="text-xl font-black">Resource<span className="text-indigo-400">Book</span></div><div className="flex gap-3"><Link to="/login" className="btn-secondary">Sign in</Link><Link to="/register" className="btn bg-indigo-600 text-white hover:bg-indigo-500">Get started</Link></div></nav><section className="mx-auto max-w-6xl px-6 pb-24 pt-20"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.25em] text-indigo-300">Community infrastructure</p><h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">One place to discover and book public resources.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Manage community halls, sports grounds, laboratories, meeting rooms and more with availability calendars, approval workflows and payment records.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/register" className="btn bg-white text-slate-900">Create account</Link><Link to="/login" className="btn border border-slate-700 bg-transparent text-white hover:bg-slate-800">View demo</Link></div></div><div className="mt-16 grid gap-4 sm:grid-cols-3">{[['Availability','See resource schedules before requesting a slot.'],['Approval workflow','Admins can review, approve or reject requests.'],['Analytics','Understand resource utilization over time.']].map(([a,b])=><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5" key={a}><h3 className="font-bold">{a}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{b}</p></div>)}</div></section></div>
}

function RoleRedirect(){const {user,loading}=useAuth();if(loading)return <div className="p-8">Loading…</div>;return <Navigate to={user?.role==='ADMIN'?'/admin':'/dashboard'} replace/>}

export default function App(){
 return <AuthProvider><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/home" element={<RoleRedirect/>}/><Route element={<ProtectedRoute roles={['USER']} />}><Route element={<Layout/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/resources" element={<Resources/>}/><Route path="/resources/:id" element={<ResourceDetails/>}/><Route path="/bookings" element={<Bookings/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/settings" element={<Settings/>}/></Route></Route><Route element={<ProtectedRoute adminOnly/>}><Route element={<AdminLayout/>}><Route path="/admin" element={<AdminOverview/>}/><Route path="/admin/bookings" element={<AdminBookings/>}/><Route path="/admin/resources" element={<AdminResources/>}/><Route path="/admin/users" element={<AdminUsers/>}/><Route path="/admin/payments" element={<AdminPayments/>}/><Route path="/admin/reports" element={<AdminReports/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></AuthProvider>
}
