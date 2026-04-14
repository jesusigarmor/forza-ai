import { redirect } from 'next/navigation';
import { FloatingNav } from '@/components/floating-nav';
import { getSession } from '@/lib/auth';
import { getStravaConnectionByUserId } from '@/lib/db';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect('/login');

  const connection = await getStravaConnectionByUserId(user.id);

  return (
    <div className="min-h-screen">
      <FloatingNav stravaConnected={!!connection} />
      <main>{children}</main>
    </div>
  );
}
