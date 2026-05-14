import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ProjectForm } from './ProjectForm'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('creator_id', session!.user.id)
    .order('created_at', { ascending: false })

  // Leads for the creator's projects
  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      projects!inner (title, creator_id)
    `)
    .eq('projects.creator_id', session!.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and leads.</p>
        </div>
        <ProjectForm />
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="leads">My Leads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          {projects?.length === 0 ? (
            <Card className="py-12 text-center">
              <CardContent>
                <p className="text-muted-foreground mb-4">You haven't listed any projects yet.</p>
                <ProjectForm />
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects?.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-2">
                      {project.ai_tools_used?.map((tool: string) => (
                        <Badge key={tool} variant="secondary">{tool}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leads">
          {leads?.length === 0 ? (
            <Card className="py-12 text-center">
              <CardContent>
                <p className="text-muted-foreground">No leads received yet. Keep building!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {leads?.map((lead) => (
                <Card key={lead.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lead.client_email}</CardTitle>
                      <Badge variant={lead.status === 'new' ? 'default' : 'outline'}>{lead.status}</Badge>
                    </div>
                    <CardDescription>Interested in: {lead.projects?.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm border-l-2 border-primary/50 pl-4 py-1 italic">{lead.message}</p>
                    <p className="text-xs text-muted-foreground mt-4">
                      Received on {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
