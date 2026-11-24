/*
# Create user preferences, stock minimum defaults, and notification state tables

## Overview
Adds three new tables for persistent user configuration:
1. preferencias_usuario — stores per-user theme, notification, and alert settings
2. padroes_estoque_minimo — stores global and per-category default minimum stock values
3. estado_notificacoes — tracks per-product notification state to prevent duplicate alerts

## New Tables

### 1. preferencias_usuario (User Preferences)
- `id` (uuid, PK) — auto-generated
- `usuario_id` (uuid, FK to auth.users, NOT NULL, DEFAULT auth.uid()) — owner
- `tema` (text, NOT NULL, DEFAULT 'claro') — 'claro' or 'escuro'
- `notificacoes_estoque_ativas` (boolean, NOT NULL, DEFAULT false) — whether early-warning notifications are enabled
- `antecedencia_aviso` (integer, NOT NULL, DEFAULT 2) — how many units before minimum to warn
- `dias_para_considerar_parado` (integer, NOT NULL, DEFAULT 60) — stale product threshold in days
- `data_criacao` (timestamptz) — creation timestamp
- `data_atualizacao` (timestamptz) — last update timestamp
- Unique constraint on usuario_id (one row per user)

### 2. padroes_estoque_minimo (Stock Minimum Defaults)
- `id` (uuid, PK) — auto-generated
- `usuario_id` (uuid, FK to auth.users, NOT NULL, DEFAULT auth.uid()) — owner
- `categoria_id` (uuid, FK to categorias, nullable) — null means global default, non-null means category-specific
- `quantidade_minima` (integer, NOT NULL) — default minimum stock value, must be >= 0
- `data_criacao` (timestamptz) — creation timestamp
- `data_atualizacao` (timestamptz) — last update timestamp
- Unique constraint on (usuario_id, categoria_id) — prevents duplicate configs per user+category combo

### 3. estado_notificacoes (Notification State)
- `id` (uuid, PK) — auto-generated
- `usuario_id` (uuid, FK to auth.users, NOT NULL, DEFAULT auth.uid()) — owner
- `produto_id` (uuid, FK to produtos, NOT NULL) — product reference
- `alerta_ativo` (boolean, NOT NULL, DEFAULT false) — whether a warning notification has been fired and not yet rearmed
- `data_criacao` (timestamptz) — creation timestamp
- `data_atualizacao` (timestamptz) — last update timestamp
- Unique constraint on (usuario_id, produto_id) — one state row per user+product

## Security
- RLS enabled on all three tables
- Grants limited to authenticated role only (app requires sign-in)
- 4 separate policies per table (SELECT, INSERT, UPDATE, DELETE), all scoped by auth.uid()
- usuario_id columns default to auth.uid() so inserts work without client passing the owner
- Cross-user access prevented
*/

-- ============================================================
-- PREFERENCIAS_USUARIO
-- ============================================================
CREATE TABLE IF NOT EXISTS preferencias_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  tema text NOT NULL DEFAULT 'claro' CHECK (tema IN ('claro', 'escuro')),
  notificacoes_estoque_ativas boolean NOT NULL DEFAULT false,
  antecedencia_aviso integer NOT NULL DEFAULT 2,
  dias_para_considerar_parado integer NOT NULL DEFAULT 60,
  data_criacao timestamptz NOT NULL DEFAULT now(),
  data_atualizacao timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS preferencias_usuario_usuario_key
  ON preferencias_usuario (usuario_id);

ALTER TABLE preferencias_usuario ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON preferencias_usuario TO authenticated;

DROP POLICY IF EXISTS "select_own_preferencias" ON preferencias_usuario;
CREATE POLICY "select_own_preferencias" ON preferencias_usuario FOR SELECT
  TO authenticated USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "insert_own_preferencias" ON preferencias_usuario;
CREATE POLICY "insert_own_preferencias" ON preferencias_usuario FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "update_own_preferencias" ON preferencias_usuario;
CREATE POLICY "update_own_preferencias" ON preferencias_usuario FOR UPDATE
  TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "delete_own_preferencias" ON preferencias_usuario;
CREATE POLICY "delete_own_preferencias" ON preferencias_usuario FOR DELETE
  TO authenticated USING (auth.uid() = usuario_id);

-- ============================================================
-- PADROES_ESTOQUE_MINIMO
-- ============================================================
CREATE TABLE IF NOT EXISTS padroes_estoque_minimo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  categoria_id uuid REFERENCES categorias(id) ON DELETE CASCADE,
  quantidade_minima integer NOT NULL,
  data_criacao timestamptz NOT NULL DEFAULT now(),
  data_atualizacao timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quantidade_minima_nao_negativo CHECK (quantidade_minima >= 0)
);

-- Prevent duplicate configs for same user+category combination
-- COALESCE handles NULL categoria_id in the unique index
CREATE UNIQUE INDEX IF NOT EXISTS padroes_estoque_minimo_usuario_categoria_key
  ON padroes_estoque_minimo (usuario_id, COALESCE(categoria_id, '00000000-0000-0000-0000-000000000000'));

ALTER TABLE padroes_estoque_minimo ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON padroes_estoque_minimo TO authenticated;

DROP POLICY IF EXISTS "select_own_padroes" ON padroes_estoque_minimo;
CREATE POLICY "select_own_padroes" ON padroes_estoque_minimo FOR SELECT
  TO authenticated USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "insert_own_padroes" ON padroes_estoque_minimo;
CREATE POLICY "insert_own_padroes" ON padroes_estoque_minimo FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "update_own_padroes" ON padroes_estoque_minimo;
CREATE POLICY "update_own_padroes" ON padroes_estoque_minimo FOR UPDATE
  TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "delete_own_padroes" ON padroes_estoque_minimo;
CREATE POLICY "delete_own_padroes" ON padroes_estoque_minimo FOR DELETE
  TO authenticated USING (auth.uid() = usuario_id);

-- ============================================================
-- ESTADO_NOTIFICACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS estado_notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  produto_id uuid NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  alerta_ativo boolean NOT NULL DEFAULT false,
  data_criacao timestamptz NOT NULL DEFAULT now(),
  data_atualizacao timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS estado_notificacoes_usuario_produto_key
  ON estado_notificacoes (usuario_id, produto_id);

ALTER TABLE estado_notificacoes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON estado_notificacoes TO authenticated;

DROP POLICY IF EXISTS "select_own_estado_notif" ON estado_notificacoes;
CREATE POLICY "select_own_estado_notif" ON estado_notificacoes FOR SELECT
  TO authenticated USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "insert_own_estado_notif" ON estado_notificacoes;
CREATE POLICY "insert_own_estado_notif" ON estado_notificacoes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "update_own_estado_notif" ON estado_notificacoes;
CREATE POLICY "update_own_estado_notif" ON estado_notificacoes FOR UPDATE
  TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "delete_own_estado_notif" ON estado_notificacoes;
CREATE POLICY "delete_own_estado_notif" ON estado_notificacoes FOR DELETE
  TO authenticated USING (auth.uid() = usuario_id);
