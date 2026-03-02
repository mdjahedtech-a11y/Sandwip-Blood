-- ১. আগের টেবিল ডিলিট করা (Clean Slate)
DROP TABLE IF EXISTS donors;

-- ২. ডোনার টেবিল তৈরি করা
CREATE TABLE donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL, -- ইউজার আইডির সাথে লিঙ্ক
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  area TEXT NOT NULL,
  last_donation_date DATE,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- একজন ইউজারের একটাই ডোনার প্রোফাইল থাকবে
);

-- ৩. সিকিউরিটি (RLS) অন করা
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- ৪. পলিসি তৈরি করা (খুব গুরুত্বপূর্ণ)

-- পলিসি ১: যে কেউ (লগইন করা বা না করা ইউজার) ডোনার লিস্ট দেখতে পারবে।
-- (ডোনার না হয়েও খোঁজা যাবে, এমনকি লগইন না করেও)
CREATE POLICY "Allow public to view all donors"
ON donors FOR SELECT
TO public
USING (true);

-- পলিসি ২: ইউজার শুধু নিজের প্রোফাইল তৈরি করতে পারবে
CREATE POLICY "Allow users to create their own donor profile"
ON donors FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- পলিসি ৩: ইউজার শুধু নিজের প্রোফাইল আপডেট করতে পারবে
CREATE POLICY "Allow users to update their own donor profile"
ON donors FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- ৫. স্টোরেজ বাকেট তৈরি (ছবি আপলোডের জন্য)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('donor-photos', 'donor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- স্টোরেজ পলিসি: সবাই ছবি দেখতে পারবে
CREATE POLICY "Public Access to Photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'donor-photos' );

-- স্টোরেজ পলিসি: লগইন করা ইউজার ছবি আপলোড করতে পারবে
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'donor-photos' AND auth.uid() = owner );

-- স্টোরেজ পলিসি: নিজের ছবি ডিলিট/আপডেট করতে পারবে
CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'donor-photos' AND auth.uid() = owner );
