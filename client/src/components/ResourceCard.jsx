import { Link } from 'react-router-dom'
import { MapPin, Users, UserRound } from 'lucide-react'

export default function ResourceCard({ resource }) {
  return (
    <div className="card overflow-hidden">
      <div className="h-40 bg-slate-200">
        <img className="h-full w-full object-cover" src={resource.imageUrl} alt={resource.name}/>
      </div>
      <div className="p-5">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-600">{resource.type}</div>
        <h3 className="text-lg font-bold">{resource.name}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-slate-500">
          <div className="flex gap-2"><MapPin size={16}/>{resource.location}</div>
          <div className="flex gap-2"><Users size={16}/>{resource.capacity} people</div>{resource.owner?.name&&<div className="flex gap-2"><UserRound size={16}/>Provided by {resource.owner.name}</div>}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-bold">₹{Number(resource.pricePerHour).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/hour</span></span>
          <Link className="btn-primary" to={`/resources/${resource.id}`}>View details</Link>
        </div>
      </div>
    </div>
  )
}
