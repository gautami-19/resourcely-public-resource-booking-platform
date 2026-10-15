import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { BarChart3, Building2, CalendarCheck2, CreditCard, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AdminLink({ to, icon: Icon, children }) {
  return <NavLink end={to === '/admin'} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}><Icon size={18}/>{children}</NavLink>
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const signOut = () => { logout(); navigate('/login') }

  return <div className="min-h-screen bg-slate-50">
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-2 py-3">
        <Link to="/admin" className="text-xl font-black">Resource<span className="text-indigo-600">Book</span><span className="ml-2 rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">PROVIDER</span></Link>
        <button className="md:hidden" onClick={() => setOpen(false)}><X/></button>
      </div>
      <p className="px-2 pb-3 pt-6 text-xs font-bold uppercase tracking-wider text-slate-400">Management</p>
      <div className="space-y-1">
        <AdminLink to="/admin" icon={LayoutDashboard}>Overview</AdminLink>
        <AdminLink to="/admin/bookings" icon={CalendarCheck2}>All Bookings</AdminLink>
        <AdminLink to="/admin/resources" icon={Building2}>Resources</AdminLink>
        <AdminLink to="/admin/users" icon={Users}>Users</AdminLink>
        <AdminLink to="/admin/payments" icon={CreditCard}>Payments</AdminLink>
        <AdminLink to="/admin/reports" icon={BarChart3}>Reports & Analytics</AdminLink>
      </div>
      <div className="absolute bottom-4 left-4 right-4 border-t border-slate-100 pt-4">
        <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600"><strong>{user?.name}</strong><br/><span>{user?.email}</span></div>
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut size={18}/>Logout</button>
      </div>
    </aside>
    <div className="md:pl-72">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
        <button className="md:hidden" onClick={() => setOpen(true)}><Menu/></button>
        <div><p className="text-sm font-bold text-slate-900">Resource Provider Portal</p><p className="hidden text-xs text-slate-500 sm:block">Manage your resources and customer bookings</p></div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{user?.name?.[0]}</div>
      </header>
      <main className="p-4 md:p-8"><Outlet /></main>
    </div>
  </div>
}
