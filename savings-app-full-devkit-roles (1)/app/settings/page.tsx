'use client';
import { useEffect, useState } from 'react';
export default function SettingsPage() {
  const [loading,setLoading]=useState(true); const [unauth,setUnauth]=useState(false); const [emailReminders,setEmailReminders]=useState(false); const [currency,setCurrency]=useState('SEK'); const [saving,setSaving]=useState(false);
  useEffect(()=>{(async()=>{const res=await fetch('/api/settings'); if(res.status===401){setUnauth(true);setLoading(false);return;} const data=await res.json(); setEmailReminders(Boolean(data.emailReminders)); setCurrency(data.currency||'SEK'); setLoading(false);})()},[]);
  async function save(){ setSaving(true); const res=await fetch('/api/settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({emailReminders,currency})}); setSaving(false); if(res.ok) alert('Saved!'); }
  if(loading) return <div>Loading…</div>;
  if(unauth) return <div className="card max-w-md"><h1 className="text-xl font-semibold mb-3">Sign in required</h1><a className="btn btn-primary" href="/api/auth/signin">Sign in with Google</a></div>;
  return (<div className="card max-w-lg"><h1 className="text-xl font-semibold mb-3">Settings</h1><div className="space-y-4">
    <label className="flex items-center gap-3"><input type="checkbox" checked={emailReminders} onChange={e=>setEmailReminders(e.target.checked)}/><span>Email reminders for due weeks</span></label>
    <div><label className="block text-sm mb-1">Currency</label><input className="border rounded-lg px-3 py-2 w-full" value={currency} onChange={e=>setCurrency(e.target.value.toUpperCase())}/></div>
    <button className="btn btn-primary" disabled={saving} onClick={save}>{saving?'Saving…':'Save settings'}</button>
  </div></div>);
}
