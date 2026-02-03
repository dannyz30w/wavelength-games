-- Add password field to rooms table for private room functionality
ALTER TABLE public.rooms 
ADD COLUMN password text DEFAULT NULL;

-- Password should only be set for private rooms