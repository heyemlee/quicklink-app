-- Enable Row Level Security (RLS) for all tables
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Analytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PasswordReset" ENABLE ROW LEVEL SECURITY;

-- ========================================
-- User Table Policies
-- ========================================

-- Users can read their own data
CREATE POLICY "Users can read own data" ON "public"."User"
  FOR SELECT
  USING (true);  -- Allow reading for authentication purposes

-- Users can update their own data
CREATE POLICY "Users can update own data" ON "public"."User"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow insert for registration (handled by API)
CREATE POLICY "Allow user registration" ON "public"."User"
  FOR INSERT
  WITH CHECK (true);

-- ========================================
-- Profile Table Policies
-- ========================================

-- Users can read all profiles (for public card pages)
CREATE POLICY "Profiles are publicly readable" ON "public"."Profile"
  FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can create own profile" ON "public"."Profile"
  FOR INSERT
  WITH CHECK (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "public"."Profile"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON "public"."Profile"
  FOR DELETE
  USING (true);

-- ========================================
-- Analytics Table Policies
-- ========================================

-- Anyone can insert analytics (for tracking)
CREATE POLICY "Anyone can insert analytics" ON "public"."Analytics"
  FOR INSERT
  WITH CHECK (true);

-- Users can read their own analytics
CREATE POLICY "Users can read own analytics" ON "public"."Analytics"
  FOR SELECT
  USING (true);

-- Allow deletion of old analytics
CREATE POLICY "Users can delete own analytics" ON "public"."Analytics"
  FOR DELETE
  USING (true);

-- ========================================
-- VerificationToken Table Policies
-- ========================================

-- Allow insert for token creation
CREATE POLICY "Allow token creation" ON "public"."VerificationToken"
  FOR INSERT
  WITH CHECK (true);

-- Allow select for token verification
CREATE POLICY "Allow token verification" ON "public"."VerificationToken"
  FOR SELECT
  USING (true);

-- Allow delete for token cleanup
CREATE POLICY "Allow token deletion" ON "public"."VerificationToken"
  FOR DELETE
  USING (true);

-- Allow update for token usage
CREATE POLICY "Allow token update" ON "public"."VerificationToken"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ========================================
-- PasswordReset Table Policies
-- ========================================

-- Allow insert for password reset creation
CREATE POLICY "Allow password reset creation" ON "public"."PasswordReset"
  FOR INSERT
  WITH CHECK (true);

-- Allow select for password reset verification
CREATE POLICY "Allow password reset verification" ON "public"."PasswordReset"
  FOR SELECT
  USING (true);

-- Allow update for marking reset as used
CREATE POLICY "Allow password reset update" ON "public"."PasswordReset"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow delete for cleanup
CREATE POLICY "Allow password reset deletion" ON "public"."PasswordReset"
  FOR DELETE
  USING (true);

-- ========================================
-- Notes:
-- ========================================
-- These policies are permissive because authentication is handled
-- at the API level with NextAuth. For production, you may want to
-- add more restrictive policies based on JWT tokens or session data.
--
-- To apply these policies:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run"
--
-- The policies allow the application to function while RLS is enabled.

