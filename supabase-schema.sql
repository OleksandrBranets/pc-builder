-- Supabase Schema for PC Components Database
-- Run this SQL in your Supabase SQL Editor

-- Cases Table
CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  width TEXT,
  depth TEXT,
  height TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CPUs Table
CREATE TABLE cpus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  cores INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GPUs Table
CREATE TABLE gpus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  boost_clock TEXT,
  vram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RAM Table
CREATE TABLE ram (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  ram_type TEXT,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CPU Coolers Table
CREATE TABLE cpu_coolers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HDDs Table
CREATE TABLE hdds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  capacity TEXT,
  rpm TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SSDs Table
CREATE TABLE ssds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  capacity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Motherboards Table
CREATE TABLE motherboards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  memory_type TEXT,
  max_memory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PSUs Table
CREATE TABLE psus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  wattage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitors Table
CREATE TABLE monitors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  screen_size TEXT,
  resolution TEXT,
  refresh_rate TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE ram ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpu_coolers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hdds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssds ENABLE ROW LEVEL SECURITY;
ALTER TABLE motherboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE psus ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitors ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON cpus FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON gpus FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ram FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON cpu_coolers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON hdds FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ssds FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON motherboards FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON psus FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON monitors FOR SELECT USING (true);
