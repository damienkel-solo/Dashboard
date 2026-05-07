'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitLead } from '@/app/actions/leads'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

export function HireModal({ projectId, creatorName }: { projectId: string, creatorName: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAction(formData: FormData) {
    setLoading(true)
    const result = await submitLead(projectId, formData)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Request sent successfully! We'll be in touch soon.")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={<Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2" />}
      >
        <Send size={18} />
        Hire This Creator
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hire {creatorName}</DialogTitle>
          <DialogDescription>
            Send a request to hire this creator. Our team will verify your request and connect you securely.
          </DialogDescription>
        </DialogHeader>
        <form action={handleAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="Describe your project needs..."
              className="col-span-3 h-24"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
