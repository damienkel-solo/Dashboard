import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LoginForm } from './LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <LoginForm />
    </div>
  )
}
