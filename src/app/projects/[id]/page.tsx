import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HireModal } from './HireModal'

// Ensure params is correctly typed for Next 15 async page props
export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const projectId = params.id;
  
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:creator_id (username, bio, avatar_url)
    `)
    .eq('id', projectId)
    .single()

  if (error || !project) {
    notFound()
  }

  const profile: any = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
  const creatorName = profile?.username || 'Unknown Creator'

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{project.title}</h1>
            <p className="text-muted-foreground text-lg">{project.description}</p>
          </div>
          
          {project.screenshot_url && (
            <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted">
              {/* Using standard img to avoid next/image domain config issues right now */}
              <img 
                src={project.screenshot_url} 
                alt={`${project.title} screenshot`}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {project.ai_tools_used && project.ai_tools_used.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">AI Tools Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.ai_tools_used.map((tool: string) => (
                  <span key={tool} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Creator Profile</CardTitle>
              <CardDescription>Created by {creatorName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.avatar_url && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={profile.avatar_url} 
                    alt={creatorName}
                    className="w-24 h-24 rounded-full border-4 border-background shadow-sm"
                  />
                </div>
              )}
              {profile?.bio && (
                <p className="text-sm text-center italic mb-4">"{profile.bio}"</p>
              )}
              
              <div className="pt-4 border-t">
                {project.demo_url && (
                  <a 
                    href={project.demo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center p-2 mb-3 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors"
                  >
                    View Live Demo
                  </a>
                )}
                
                {/* 
                  Instead of showing the creator's email:
                  Show the "Hire This Creator" modal
                */}
                <HireModal projectId={project.id} creatorName={creatorName} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
