/*
  # Create MySQL Connections Schema

  1. New Tables
    - `mysql_connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `host` (text)
      - `port` (integer)
      - `database` (text)
      - `username` (text)
      - `password` (text, encrypted)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mysql_connections` table
    - Add policies for authenticated users to manage their connections
*/

CREATE TABLE mysql_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  host text NOT NULL,
  port integer NOT NULL DEFAULT 3306,
  database text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mysql_connections ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own connections
CREATE POLICY "Users can create their own connections"
  ON mysql_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own connections
CREATE POLICY "Users can view their own connections"
  ON mysql_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to update their own connections
CREATE POLICY "Users can update their own connections"
  ON mysql_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own connections
CREATE POLICY "Users can delete their own connections"
  ON mysql_connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);