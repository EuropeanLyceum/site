import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient'; // Імпортуємо клієнтську частину

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  // Серверна перевірка безпеки
  if (!token) {
    redirect('/login');
  }

  // Повертаємо клієнтський візуал
  return <DashboardClient />;
}