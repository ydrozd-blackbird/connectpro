-- Create the waitlist_entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Add a Row Level Security (RLS) policy if you plan to expose this table more directly later.
-- For now, since we're using the service_role key in a server action, it bypasses RLS by default.
-- However, it's good practice to enable RLS.
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Allow public read access (e.g., if you wanted to show a count, though not used here)
-- CREATE POLICY "Allow public read access" ON waitlist_entries FOR SELECT USING (true);

-- Allow authenticated users to insert (not strictly needed for service_role but good for other contexts)
-- CREATE POLICY "Allow authenticated insert" ON waitlist_entries FOR INSERT TO authenticated WITH CHECK (true);

-- For server-side operations with service_role, explicit policies might not be strictly necessary
-- but it's good to be aware of RLS.
-- For this specific waitlist scenario using a server action with service_role,
-- the service_role key has super admin privileges and bypasses RLS.
-- If you were to use anon key or user-specific keys, RLS policies would be crucial.

-- Add an index on the email column for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email ON waitlist_entries(email);
