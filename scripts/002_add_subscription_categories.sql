-- Add category and invoice_file_url columns to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS invoice_file_url TEXT;

-- Add a check constraint for valid categories
ALTER TABLE subscriptions 
ADD CONSTRAINT valid_category 
CHECK (category IS NULL OR category IN (
  'Marketing', 
  'Design', 
  'Development', 
  'Operations', 
  'Sales', 
  'HR', 
  'Finance', 
  'Legal',
  'IT',
  'Other'
));
