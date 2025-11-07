import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session-user';
export async function GET() {
  const { user } = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const fresh = await prisma.user.findUnique({ where: { id: user.id } });
  return NextResponse.json({ emailReminders: fresh?.emailReminders ?? false, currency: fresh?.currency ?? 'SEK' });
}
export async function PATCH(req: NextRequest) {
  const { user } = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const emailReminders = Boolean(body.emailReminders);
  const currency = typeof body.currency === 'string' ? body.currency : undefined;
  const updated = await prisma.user.update({ where: { id: user.id }, data: { emailReminders, ...(currency ? { currency } : {}) } });
  return NextResponse.json({ ok: true, user: { emailReminders: updated.emailReminders, currency: updated.currency } });
}
