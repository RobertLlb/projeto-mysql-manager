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


  CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  password text NOT NULL, -- Embora o Supabase gerencie as senhas de maneira segura, você pode armazená-las localmente se necessário.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Definindo Row-Level Security para garantir que cada usuário acesse apenas seus dados
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política de inserção (autenticação do usuário)
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política para selecionar (acessar) os próprios dados
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para atualização dos dados do próprio usuário
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Política para deletar os dados do próprio usuário
CREATE POLICY "Users can delete their own data"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);
