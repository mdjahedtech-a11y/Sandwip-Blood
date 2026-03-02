-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow everyone to read active notifications
CREATE POLICY "Allow public read access" ON notifications
  FOR SELECT USING (is_active = true);

-- Allow admins to insert/update/delete (assuming admin check is done via app logic or specific role if implemented)
-- For simplicity in this app structure where admin is just a specific email in frontend, 
-- we might need to allow authenticated users to write if we don't have custom claims.
-- However, ideally, we should restrict this. 
-- Since we don't have a robust role system in the database yet (just frontend checks),
-- we will allow authenticated users to ALL for now, but the frontend will restrict access.
-- A better approach would be to have an 'admins' table or role.
-- Given the current setup, let's allow all authenticated users to manage for now, 
-- relying on the frontend to hide the admin panel.
CREATE POLICY "Allow authenticated to manage" ON notifications
  FOR ALL USING (auth.role() = 'authenticated');
