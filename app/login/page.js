// /app/login/page.jsx — ЗАМЕНИ ПОЛНОСТЬЮ
import AuthScreen from '@/components/Auth/AuthScreen';

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams; // ← распаковка промиса
  const search = typeof sp?.from === 'string' ? sp.from : null;
  return <AuthScreen search={search} />;
}
