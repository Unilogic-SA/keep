-- Add equipment history tracking table
CREATE TABLE IF NOT EXISTS equipment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE equipment_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own equipment history
CREATE POLICY "Users can view their own equipment history"
  ON equipment_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own equipment history
CREATE POLICY "Users can insert their own equipment history"
  ON equipment_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS equipment_history_equipment_id_idx ON equipment_history(equipment_id);
CREATE INDEX IF NOT EXISTS equipment_history_created_at_idx ON equipment_history(changed_at DESC);
