import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bell, CalendarDays, Home, LayoutDashboard, LogOut, Menu, Settings, Shield, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function SideLink({ to, icon: Icon, children }) {
  return <NavLink to={to} className={({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`
  }><Icon size={18}/>{children}</NavLink>
}

export default function Layout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function signOut() { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-4 transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2 py-3">
          <Link to="/" className="text-xl font-black tracking-tight">Resource<span className="text-indigo-600">Book</span></Link>
          <button className="md:hidden" onClick={() => setOpen(false)}><X/></button>
        </div>
        <div className="mt-6 space-y-1">
          <SideLink to="/dashboard" icon={LayoutDashboard}>Dashboard</SideLink>
          <SideLink to="/resources" icon={Home}>Resources</SideLink>
          <SideLink to="/bookings" icon={CalendarDays}>My Bookings</SideLink>
          <SideLink to="/notifications" icon={Bell}>Notifications</SideLink>
          <SideLink to="/settings" icon={Settings}>Settings</SideLink>
          {user?.role === 'ADMIN' && <SideLink to="/admin" icon={Shield}>Admin Panel</SideLink>}
        </div>
        <div className="absolute bottom-4 left-4 right-4 border-t border-slate-100 pt-4">
          <div className="mb-3 px-2 text-xs text-slate-500">{user?.name}<br/><span>{user?.email}</span></div>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"><LogOut size={18}/>Logout</button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)}><Menu/></button>
          <div className="text-sm text-slate-500">Community Infrastructure Booking</div>
          <div className="flex items-center gap-3"><span className="hidden text-sm font-medium sm:block">{user?.name}</span><div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">{user?.name?.[0]}</div></div>
        </header>
        <main className="p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
