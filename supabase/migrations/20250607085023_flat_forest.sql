/*
  # Create users table and demo user

  1. New Tables
    - `users` table with basic user profile information
  2. Security
    - Enable RLS on users table
    - Add policies for users to read and update their own data
  3. Demo User
    - Create a demo user account for testing
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DO $$
BEGIN
  -- Policy for users to read their own data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Policy for users to update their own data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create trigger for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_users_updated_at'
  ) THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert demo user into auth.users if it doesn't exist
DO $$
DECLARE
  demo_user_id uuid;
  instance_id uuid;
BEGIN
  -- Get the instance_id
  SELECT id INTO instance_id FROM auth.instances LIMIT 1;
  
  -- Check if demo user already exists
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@esgsoluce.com';

  -- If demo user doesn't exist, create it
  IF demo_user_id IS NULL THEN
    -- Generate a UUID for the demo user
    demo_user_id := gen_random_uuid();
    
    -- Insert into auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token,
      aud,
      role
    ) VALUES (
      demo_user_id,
      instance_id,
      'demo@esgsoluce.com',
      crypt('Demo123!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      '',
      '',
      '',
      'authenticated',
      'authenticated'
    );

    -- Insert into auth.identities without the email column
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      demo_user_id,
      jsonb_build_object('sub', demo_user_id::text, 'email', 'demo@esgsoluce.com'),
      'email',
      'demo@esgsoluce.com',  -- Using email as provider_id
      now(),
      now()
    );
  END IF;

  -- Ensure user profile exists in users table
  INSERT INTO users (id, email, created_at, updated_at)
  VALUES (demo_user_id, 'demo@esgsoluce.com', now(), now())
  ON CONFLICT (id) DO NOTHING;

END $$;