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
import { createProject } from '@/app/actions/projects'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function ProjectForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAction(formData: FormData) {
    setLoading(true)
    const result = await createProject(formData)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Project added successfully!")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer" />}
      >
        <Plus size={18} />
        New Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add a New Project</DialogTitle>
          <DialogDescription>
            List your project on the marketplace.
          </DialogDescription>
        </DialogHeader>
        <form action={handleAction} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
            <Input id="title" name="title" required placeholder="e.g. AI Image Generator" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea 
              id="description" 
              name="description" 
              required 
              placeholder="What does it do? Who is it for?" 
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo_url">Live Demo URL</Label>
            <Input id="demo_url" name="demo_url" type="url" placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai_tools">AI Tools Used (comma separated)</Label>
            <Input id="ai_tools" name="ai_tools" placeholder="OpenAI, Vercel v0, Cursor" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Screenshot</Label>
            <Input id="screenshot" name="screenshot" type="file" accept="image/*" className="cursor-pointer" />
            <p className="text-xs text-muted-foreground">Upload a compelling screenshot (max 5MB).</p>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? 'Saving...' : 'Publish Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
