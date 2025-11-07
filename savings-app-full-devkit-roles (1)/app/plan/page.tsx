'use client';
import { useEffect, useState } from 'react';
import type { PlanEntry, PlanSummaryFull } from '@/types';
export default function PlanPage() {
  const [data,setData]=useState<PlanSummaryFull|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<string|null>(null); const [creating,setCreating]=useState(false); const [unauth,setUnauth]=useState(false);
  async function load(){ setLoading(true); try{ const res=await fetch('/api/plan',{cache:'no-store'}); if(res.status===401){setUnauth(true);return;} if(!res.ok) throw new Error('Failed to load'); const json=await res.json(); setData(json);}catch(e:any){setError(e.message);}finally{setLoading(false);}}
  useEffect(()=>{load();},[]);
  async function handleCreate(e:any){ e.preventDefault(); setCreating(true); const fd=new FormData(e.target); const body=Object.fromEntries(fd.entries());
    const res=await fetch('/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ baseAmount:Number(body.baseAmount), planType:body.planType, startDate:body.startDate })}); setCreating(false); if(res.ok) load(); }
  if(loading) return <div>Loading…</div>;
  if(unauth) return <div className="card max-w-md"><h1 className="text-xl font-semibold mb-3">Sign in required</h1><a className="btn btn-primary" href="/api/auth/signin">Sign in with Google</a></div>;
  if(error) return <div className="text-red-600">{error}</div>;
  if(!data?.entries?.length){
    const nextMonday=(()=>{const d=new Date();const day=d.getDay();const diff=(8-day)%7||7;d.setDate(d.getDate()+diff);return d.toISOString().slice(0,10);})();
    return (<div className="card max-w-md">
      <h1 className="text-xl font-semibold mb-3">Start 52-Week Plan</h1>
      <form onSubmit={handleCreate} className="space-y-3">
        <div><label className="block text-sm mb-1">Base amount (SEK)</label><input name="baseAmount" type="number" step="0.01" className="border rounded-lg px-3 py-2 w-full" required/></div>
        <div><label className="block text-sm mb-1">Plan type</label><select name="planType" className="border rounded-lg px-3 py-2 w-full"><option value="FIXED">Fixed</option><option value="LADDER">Ladder (1x…52x)</option><option value="REVERSE_LADDER">Reverse Ladder (52x…1x)</option></select></div>
        <div><label className="block text-sm mb-1">Start date</label><input name="startDate" type="date" defaultValue={nextMonday} className="border rounded-lg px-3 py-2 w-full"/></div>
        <button disabled={creating} className="btn btn-primary w-full">{creating?'Creating…':'Create Plan'}</button>
      </form>
    </div>);
  }
  return (<div className="card overflow-x-auto">
    <h1 className="text-xl font-semibold mb-3">Your Plan</h1>
    <table className="table min-w-[720px]"><thead><tr><th>Week</th><th>Due Date</th><th>Planned</th><th>Actual</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {data.entries.map((e:PlanEntry)=>(<tr key={e.id}>
        <td>{e.weekNumber}</td><td>{new Date(e.dueDate).toLocaleDateString()}</td><td>{data.currency} {e.plannedAmount}</td><td>{data.currency} {e.actualAmount}</td><td>{e.status}</td>
        <td>{e.status!=='PAID' && (<form onSubmit={async ev=>{ev.preventDefault();const res=await fetch(`/api/entry/${e.id}/pay`,{method:'POST'}); if(res.ok) location.reload();}}><button className="btn btn-primary">Mark Paid</button></form>)}</td>
      </tr>))}
    </tbody></table>
  </div>);
}
