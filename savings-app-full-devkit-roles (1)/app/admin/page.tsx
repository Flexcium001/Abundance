import { requireRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';
export default async function AdminPage() {
  const { authorized } = await requireRole('ADMIN');
  if (!authorized) return <div className="card"><h1 className="text-xl font-semibold mb-2">Access denied</h1><p className="text-sm">Admins only.</p></div>;
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id:true, email:true, name:true, role:true, createdAt:true }, take: 50 });
  return (<div className="card"><h1 className="text-xl font-semibold mb-3">Admin Dashboard</h1>
    <p className="text-sm mb-4">Newest users (latest 50)</p>
    <div className="overflow-x-auto">
      <table className="table min-w-[720px]"><thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Since</th></tr></thead><tbody>
        {users.map(u=>(<tr key={u.id}><td>{u.email}</td><td>{u.name??'—'}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleString()}</td></tr>))}
      </tbody></table>
    </div>
  </div>);
}
