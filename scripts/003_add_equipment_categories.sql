-- Add category and receipt_file_url columns to equipment table
ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS receipt_file_url TEXT;

-- Add a check constraint for valid categories
ALTER TABLE equipment
ADD CONSTRAINT equipment_category_check 
CHECK (category IS NULL OR category IN ('Computers', 'Cameras', 'Audio', 'Networking', 'Furniture', 'Accessories', 'Other'));
