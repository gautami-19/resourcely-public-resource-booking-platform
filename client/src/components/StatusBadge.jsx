const styles = {
  APPROVED: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  REJECTED: 'bg-rose-50 text-rose-700',
  CANCELLED: 'bg-slate-100 text-slate-600',
  PAID: 'bg-emerald-50 text-emerald-700',
  UNPAID: 'bg-amber-50 text-amber-700',
  REFUNDED: 'bg-indigo-50 text-indigo-700'
}
export default function StatusBadge({ value }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles[value] || 'bg-slate-100 text-slate-600'}`}>{value}</span>
}
