-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  renewal_date DATE NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  owner TEXT,
  team TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'trial')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  serial_number TEXT,
  purchase_date DATE,
  value DECIMAL(10, 2),
  condition TEXT,
  assigned_to TEXT,
  availability TEXT NOT NULL DEFAULT 'storage' CHECK (availability IN ('assigned', 'storage', 'repair')),
  receipt_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for equipment
CREATE POLICY "Users can view their own equipment"
  ON equipment FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own equipment"
  ON equipment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equipment"
  ON equipment FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equipment"
  ON equipment FOR DELETE
  USING (auth.uid() = user_id);
