'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitLead(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!email || !message) {
    return { error: 'Email and message are required' }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      project_id: projectId,
      client_email: email,
      message: message,
      status: 'new'
    })
    .select()

  if (error) {
    console.error('Error submitting lead:', error)
    return { error: 'Failed to submit your request.' }
  }

  // TODO: Trigger real notification (e.g., SendGrid, Resend, or Discord webhook)
  console.log('🚨 NOTIFICATION TO ADMIN 🚨')
  console.log(`New lead received for project ${projectId} from ${email}`)

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}
