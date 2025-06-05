-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
    id VARCHAR(128) PRIMARY KEY,
    html_content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    password VARCHAR(255),
    is_protected BOOLEAN DEFAULT FALSE,
    code_type VARCHAR(32) DEFAULT 'html'
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR(255) PRIMARY KEY,
    session TEXT NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create function to create pages table if not exists
CREATE OR REPLACE FUNCTION create_pages_table_if_not_exists()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages') THEN
        CREATE TABLE pages (
            id VARCHAR(128) PRIMARY KEY,
            html_content TEXT NOT NULL,
            created_at BIGINT NOT NULL,
            password VARCHAR(255),
            is_protected BOOLEAN DEFAULT FALSE,
            code_type VARCHAR(32) DEFAULT 'html'
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

-- Enable Row Level Security (RLS)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON pages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON pages;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON pages;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON pages;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON sessions;

-- Create new policies
-- Allow public read access
CREATE POLICY "Enable read access for all users" ON pages
    FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Enable insert for all users" ON pages
    FOR INSERT WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Enable update for all users" ON pages
    FOR UPDATE USING (true);

-- Allow public delete access
CREATE POLICY "Enable delete for all users" ON pages
    FOR DELETE USING (true);

-- Sessions table policies
CREATE POLICY "Enable all access for all users" ON sessions
    FOR ALL USING (true); 