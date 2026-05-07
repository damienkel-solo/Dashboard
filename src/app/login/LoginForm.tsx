'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'

export function LoginForm() {
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [email, setEmail] = useState('')
  const supabase = createClient()

  async function handleGoogleLogin() {
    setLoadingGoogle(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      toast.error(error.message)
      setLoadingGoogle(false)
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoadingEmail(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Check your email for the login link!")
      setEmail('')
    }
    setLoadingEmail(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-3xl">Welcome</CardTitle>
        <CardDescription>Sign in to access your creator dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full font-medium cursor-pointer" 
            disabled={loadingEmail || loadingGoogle}
          >
            <Mail className="mr-2 h-4 w-4" />
            {loadingEmail ? 'Sending Link...' : 'Continue with Email (Magic Link)'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          className="w-full font-medium cursor-pointer" 
          variant="outline" 
          onClick={handleGoogleLogin}
          disabled={loadingGoogle || loadingEmail}
        >
          {loadingGoogle ? 'Connecting...' : 'Continue with Google'}
        </Button>
      </CardContent>
    </Card>
  )
}
