'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'Unauthorized' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const demo_url = formData.get('demo_url') as string
  const ai_tools = formData.get('ai_tools') as string
  const file = formData.get('screenshot') as File

  if (!title || !description) {
    return { error: 'Title and description are required.' }
  }

  let screenshot_url = null

  if (file && file.size > 0) {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${session.user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('project-screenshots')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      return { error: 'Failed to upload screenshot. Make sure the "project-screenshots" bucket exists.' }
    }

    const { data: publicUrlData } = supabase.storage
      .from('project-screenshots')
      .getPublicUrl(filePath)
    
    screenshot_url = publicUrlData.publicUrl
  }

  const ai_tools_array = ai_tools ? ai_tools.split(',').map(t => t.trim()).filter(Boolean) : []

  const { error: insertError } = await supabase
    .from('projects')
    .insert({
      creator_id: session.user.id,
      title,
      description,
      demo_url,
      screenshot_url,
      ai_tools_used: ai_tools_array
    })

  if (insertError) {
    console.error('Insert Error:', insertError)
    return { error: 'Failed to save project.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  
  return { success: true }
}
