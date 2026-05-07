-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  is_creator BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  screenshot_url TEXT,
  demo_url TEXT,
  ai_tools_used TEXT[], -- Using an array of text for AI tools
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  client_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- RLS POLICIES
-- --------------------------------------------------------

-- Profiles Policies
-- 1. Anyone can view profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING (true);

-- 2. Users can insert their own profile
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Projects Policies
-- 1. Anyone can view projects
CREATE POLICY "Projects are viewable by everyone." 
  ON public.projects FOR SELECT 
  USING (true);

-- 2. Authenticated creators can insert projects
CREATE POLICY "Creators can insert their own projects." 
  ON public.projects FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- 3. Creators can update their own projects
CREATE POLICY "Creators can update their own projects." 
  ON public.projects FOR UPDATE 
  TO authenticated
  USING (auth.uid() = creator_id);

-- 4. Creators can delete their own projects
CREATE POLICY "Creators can delete their own projects." 
  ON public.projects FOR DELETE 
  TO authenticated
  USING (auth.uid() = creator_id);

-- Leads Policies
-- 1. Anyone can insert a lead (public form submission)
CREATE POLICY "Anyone can submit a lead." 
  ON public.leads FOR INSERT 
  WITH CHECK (true);

-- 2. Creators can view leads for their own projects
CREATE POLICY "Creators can view leads for their projects." 
  ON public.leads FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM public.projects 
      WHERE projects.id = leads.project_id 
      AND projects.creator_id = auth.uid()
    )
  );

-- 3. Creators can update lead status for their own projects
CREATE POLICY "Creators can update leads for their projects." 
  ON public.leads FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM public.projects 
      WHERE projects.id = leads.project_id 
      AND projects.creator_id = auth.uid()
    )
  );
