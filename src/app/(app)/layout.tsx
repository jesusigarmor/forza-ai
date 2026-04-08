import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { getSession } from '@/lib/auth';
import { runMigrations } from '@/lib/db';

runMigrations();

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen">
      <Sidebar user={{ name: user.name }} />
      <main className="pb-20 md:pl-16 md:pb-0">{children}</main>
    </div>
  );
}
