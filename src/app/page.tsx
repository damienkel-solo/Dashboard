import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code2, Search, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default async function LandingPage() {
  const supabase = await createClient()

  // Fetch featured projects
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id, title, description, screenshot_url, ai_tools_used,
      profiles:creator_id (username, avatar_url)
    `)
    .limit(6)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl tracking-tight">AI Creator Nexus</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="font-medium cursor-pointer">Dashboard</Button>
            </Link>
            <Link href="/login">
              <Button className="font-medium bg-primary text-primary-foreground cursor-pointer">List Your Project</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-primary/5">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-foreground">
              Find the perfect <span className="text-primary">AI Web Creator</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover and hire top-tier developers building the next generation of web applications using advanced AI tools.
            </p>
            
            <div className="flex flex-col sm:flex-row max-w-xl mx-auto gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for projects, tools, or creators..." 
                  className="pl-10 h-12 text-base rounded-full border-primary/20 shadow-sm focus-visible:ring-primary"
                />
              </div>
              <Button className="h-12 px-8 rounded-full text-base font-medium cursor-pointer">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Projects Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Featured Projects</h2>
                <p className="text-muted-foreground text-lg">Explore what our top creators are building.</p>
              </div>
              <Button variant="outline" className="hidden sm:flex group cursor-pointer">
                View all <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {error ? (
              <div className="text-center py-20 text-destructive">
                Failed to load projects. Please try again later.
              </div>
            ) : projects?.length === 0 ? (
              <div className="text-center py-20 bg-muted/50 rounded-2xl border border-dashed">
                <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-heading font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to list your AI-powered project!</p>
                <Link href="/login">
                  <Button className="cursor-pointer">Submit a Project</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects?.map((project) => {
                  const profile: any = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
                  return (
                  <Link href={`/projects/${project.id}`} key={project.id} className="group cursor-pointer">
                    <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col bg-card">
                      <div className="aspect-[16/10] relative overflow-hidden bg-muted border-b">
                        {project.screenshot_url ? (
                          <img 
                            src={project.screenshot_url} 
                            alt={project.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Code2 className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="flex-1">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors line-clamp-1">
                            {project.title}
                          </CardTitle>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {project.description}
                        </p>
                      </CardHeader>
                      <CardFooter className="pt-0 flex flex-col items-start gap-4">
                        {project.ai_tools_used && project.ai_tools_used.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 w-full">
                            {project.ai_tools_used.slice(0, 3).map((tool: string) => (
                              <span key={tool} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md truncate max-w-[100px]">
                                {tool}
                              </span>
                            ))}
                            {project.ai_tools_used.length > 3 && (
                              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-md">
                                +{project.ai_tools_used.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-4 border-t border-border/50 w-full mt-auto">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                              {profile?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <span className="text-sm font-medium">{profile?.username || 'Unknown'}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                )})}
              </div>
            )}
            <div className="mt-8 sm:hidden flex justify-center">
              <Button variant="outline" className="w-full group cursor-pointer">
                View all projects <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-background">
            <Sparkles className="h-6 w-6" />
            <span className="font-heading font-bold text-xl tracking-tight">AI Creator Nexus</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AI Creator Nexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
