const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Display SQL for manual table creation
function displayCreateTablesSQL() {
  console.log('\n📋 Please create the following tables in your Supabase SQL Editor:');
  console.log('=' .repeat(80));
  console.log(`
-- Cases Table
CREATE TABLE IF NOT EXISTS cases (
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
CREATE TABLE IF NOT EXISTS cpus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  cores INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GPUs Table
CREATE TABLE IF NOT EXISTS gpus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  boost_clock TEXT,
  vram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RAM Table
CREATE TABLE IF NOT EXISTS ram (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  ram_type TEXT,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CPU Coolers Table
CREATE TABLE IF NOT EXISTS cpu_coolers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HDDs Table
CREATE TABLE IF NOT EXISTS hdds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  capacity TEXT,
  rpm TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SSDs Table
CREATE TABLE IF NOT EXISTS ssds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  capacity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Motherboards Table
CREATE TABLE IF NOT EXISTS motherboards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  memory_type TEXT,
  max_memory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PSUs Table
CREATE TABLE IF NOT EXISTS psus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  producer TEXT,
  wattage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitors Table
CREATE TABLE IF NOT EXISTS monitors (
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

-- Create policies to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON cases FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON cpus FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON gpus FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON ram FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON cpu_coolers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON hdds FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON ssds FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON motherboards FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON psus FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read access" ON monitors FOR SELECT USING (true);
`);
  console.log('=' .repeat(80));
  console.log('💡 Alternatively, copy and paste the SQL from the file: supabase-schema.sql');
  console.log('🔄 After creating the tables, run this script again: npm run migrate');
}

// CSV parsing function
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || null;
      });
      data.push(row);
    }
  }
  
  return data;
}

// Transform data for each table
function transformCaseData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    width: row.Width,
    depth: row.Depth,
    height: row.Height
  };
}

function transformCPUData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    cores: parseInt(row.Cores) || null
  };
}

function transformGPUData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    boost_clock: row['Boost Clock'],
    vram: row.Vram
  };
}

function transformRAMData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    ram_type: row['Ram Type'],
    size: row.Size
  };
}

// Transform functions for other components
function transformCPUCoolerData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer
  };
}

function transformHDDData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    capacity: row.Size,
    rpm: row.RPM
  };
}

function transformSSDData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    capacity: row.Size
  };
}

function transformMotherboardData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    memory_type: row['Memory Type'],
    max_memory: row['Memory Capacity']
  };
}

function transformPSUData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    wattage: row.Watt
  };
}

function transformMonitorData(row) {
  return {
    name: row.Name,
    price: row.Price,
    producer: row.Producer,
    screen_size: row.Size,
    resolution: row.Resolution,
    refresh_rate: row['Refresh Rate']
  };
}

// Migration functions
async function migrateCases() {
  console.log('Migrating Cases...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/CaseData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformCaseData);
  
  const { error } = await supabase.from('cases').insert(transformedData);
  if (error) {
    console.error('Error migrating cases:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} cases`);
  }
}

async function migrateCPUs() {
  console.log('Migrating CPUs...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/CPUData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformCPUData);
  
  const { error } = await supabase.from('cpus').insert(transformedData);
  if (error) {
    console.error('Error migrating CPUs:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} CPUs`);
  }
}

async function migrateGPUs() {
  console.log('Migrating GPUs...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/GPUData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformGPUData);
  
  const { error } = await supabase.from('gpus').insert(transformedData);
  if (error) {
    console.error('Error migrating GPUs:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} GPUs`);
  }
}

async function migrateRAM() {
  console.log('Migrating RAM...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/RAMData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformRAMData);
  
  const { error } = await supabase.from('ram').insert(transformedData);
  if (error) {
    console.error('Error migrating RAM:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} RAM modules`);
  }
}

// Migration functions for other components
async function migrateCPUCoolers() {
  console.log('Migrating CPU Coolers...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/CPUCoolerData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformCPUCoolerData);
  
  const { error } = await supabase.from('cpu_coolers').insert(transformedData);
  if (error) {
    console.error('Error migrating CPU Coolers:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} CPU Coolers`);
  }
}

async function migrateHDDs() {
  console.log('Migrating HDDs...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/HDDData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformHDDData);
  
  const { error } = await supabase.from('hdds').insert(transformedData);
  if (error) {
    console.error('Error migrating HDDs:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} HDDs`);
  }
}

async function migrateSSDs() {
  console.log('Migrating SSDs...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/SSDData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformSSDData);
  
  const { error } = await supabase.from('ssds').insert(transformedData);
  if (error) {
    console.error('Error migrating SSDs:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} SSDs`);
  }
}

async function migrateMotherboards() {
  console.log('Migrating Motherboards...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/MotherboardData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformMotherboardData);
  
  const { error } = await supabase.from('motherboards').insert(transformedData);
  if (error) {
    console.error('Error migrating Motherboards:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} Motherboards`);
  }
}

async function migratePSUs() {
  console.log('Migrating PSUs...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/PSUData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformPSUData);
  
  const { error } = await supabase.from('psus').insert(transformedData);
  if (error) {
    console.error('Error migrating PSUs:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} PSUs`);
  }
}

async function migrateMonitors() {
  console.log('Migrating Monitors...');
  const csvData = fs.readFileSync(path.join(__dirname, '../csv/MonitorData.csv'), 'utf8');
  const data = parseCSV(csvData);
  const transformedData = data.map(transformMonitorData);
  
  const { error } = await supabase.from('monitors').insert(transformedData);
  if (error) {
    console.error('Error migrating Monitors:', error);
  } else {
    console.log(`Successfully migrated ${transformedData.length} Monitors`);
  }
}

// Check if tables exist
async function checkTablesExist() {
  const tables = ['cases', 'cpus', 'gpus', 'ram', 'cpu_coolers', 'hdds', 'ssds', 'motherboards', 'psus', 'monitors'];
  const existingTables = [];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        existingTables.push(table);
      }
    } catch (e) {
      // Table doesn't exist
    }
  }
  
  return existingTables;
}

// Main migration function
async function migrateAll() {
  try {
    console.log('=== PC Components Data Migration ===');
    
    // Check which tables exist
    const existingTables = await checkTablesExist();
    console.log(`Found existing tables: ${existingTables.length > 0 ? existingTables.join(', ') : 'none'}`);
    
    if (existingTables.length === 0) {
      console.log('\n❌ No tables found in your Supabase database.');
      displayCreateTablesSQL();
      return;
    } else if (existingTables.length < 10) {
      console.log('\n⚠️  Some tables are missing. Found:', existingTables.join(', '));
      console.log('📋 Please create all required tables using the SQL from supabase-schema.sql');
      displayCreateTablesSQL();
      return;
    }

    // All tables exist, proceed with migration
    console.log('\n✅ All tables found! Starting data migration...');
    console.log('\n=== Migrating Data ===');
    
    await migrateCases();
    await migrateCPUs();
    await migrateGPUs();
    await migrateRAM();
    
    // Migrate other components
    await migrateCPUCoolers();
    await migrateHDDs();
    await migrateSSDs();
    await migrateMotherboards();
    await migratePSUs();
    await migrateMonitors();
    
    console.log('\n🎉 === Migration Completed Successfully! ===');
    console.log('📊 All CSV data has been imported to your Supabase database.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAll();
}

module.exports = { migrateAll };
