import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Ensure user has a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    // Auto-create profile if missing
    await supabase.from('profiles').insert({
      id: session.user.id,
      username: session.user.email?.split('@')[0] || `user_${Date.now()}`,
      is_creator: true
    })
  } else if (!profile.is_creator) {
    // Ensure they are marked as creator
    await supabase.from('profiles').update({ is_creator: true }).eq('id', session.user.id)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl tracking-tight">Creator Nexus</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">
              {session.user.email}
            </span>
            <form action="/auth/signout" method="post">
               <Button variant="ghost" size="icon" title="Sign out" className="cursor-pointer">
                 <LogOut className="h-5 w-5" />
               </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/20">
        {children}
      </main>
    </div>
  )
}
