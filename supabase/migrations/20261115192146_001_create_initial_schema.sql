/*
# Create initial database schema for stock management system

## Overview
Creates the core database tables for a multi-user stock management system
for beauty product resellers. Each user only accesses their own data.

## New Tables

### 1. categorias (Categories)
- `id` (uuid, PK) — auto-generated unique identifier
- `usuario_id` (uuid, FK to auth.users) — owner of the category, defaults to auth.uid()
- `nome` (text, NOT NULL) — category name
- `data_criacao` (timestamptz) — creation timestamp
- Unique constraint prevents duplicate category names per user (case-insensitive)

### 2. produtos (Products)
- `id` (uuid, PK) — auto-generated unique identifier
- `usuario_id` (uuid, FK to auth.users) — owner, defaults to auth.uid()
- `titulo` (text, NOT NULL) — product name
- `categoria_id` (uuid, FK to categorias) — category reference
- `preco` (numeric, NOT NULL) — selling price, must be > 0
- `estoque` (integer, NOT NULL, default 0) — current stock quantity, must be >= 0
- `estoque_minimo` (integer, NOT NULL, default 0) — minimum stock threshold, must be >= 0
- `data_criacao` (timestamptz) — creation timestamp
- `data_atualizacao` (timestamptz) — last update timestamp

### 3. movimentacoes (Stock Movements)
- `id` (uuid, PK) — auto-generated unique identifier
- `usuario_id` (uuid, FK to auth.users) — owner, defaults to auth.uid()
- `produto_id` (uuid, FK to produtos) — product reference
- `tipo` (text, NOT NULL) — 'entrada' (in) or 'saida' (out)
- `quantidade` (integer, NOT NULL) — amount moved, must be > 0
- `data_movimentacao` (timestamptz) — when the movement occurred
- Indexes on produto_id and data_movimentacao for query performance

## Security
- RLS enabled on all three tables
- Grants limited to authenticated role only (app requires sign-in)
- 4 separate policies per table (SELECT, INSERT, UPDATE, DELETE), all scoped by auth.uid()
- usuario_id columns default to auth.uid() so inserts work without client passing the owner
- Cross-user access prevented: user cannot set another user's ID on insert or update

## Functions
### registrar_movimentacao (SECURITY DEFINER)
- Atomically records a stock movement and updates the product's stock
- Prevents negative stock on saída
- Validates quantity > 0
- Verifies the product belongs to the calling user
- Revoked from anon, granted to authenticated
*/

-- ============================================================
-- CATEGORIAS
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  data_criacao timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate category names per user (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS categorias_usuario_nome_key
  ON categorias (usuario_id, lower(nome));

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON categorias TO authenticated;

DROP POLICY IF EXISTS "select_own_categorias" ON categorias;
CREATE POLICY "select_own_categorias" ON categorias FOR SELECT
  TO authenticated USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "insert_own_categorias" ON categorias;
CREATE POLICY "insert_own_categorias" ON categorias FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "update_own_categorias" ON categorias;
CREATE POLICY "update_own_categorias" ON categorias FOR UPDATE
  TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "delete_own_categorias" ON categorias;
CREATE POLICY "delete_own_categorias" ON categorias FOR DELETE
  TO authenticated USING (auth.uid() = usuario_id);

-- ============================================================
-- PRODUTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  preco numeric(10,2) NOT NULL DEFAULT 0,
  estoque integer NOT NULL DEFAULT 0,
  estoque_minimo integer NOT NULL DEFAULT 0,
  data_criacao timestamptz NOT NULL DEFAULT now(),
  data_atualizacao timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT preco_positivo CHECK (preco > 0),
  CONSTRAINT estoque_nao_negativo CHECK (estoque >= 0),
  CONSTRAINT estoque_minimo_nao_negativo CHECK (estoque_minimo >= 0)
);

CREATE INDEX IF NOT EXISTS idx_produtos_usuario ON produtos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON produtos TO authenticated;

DROP POLICY IF EXISTS "select_own_produtos" ON produtos;
CREATE POLICY "select_own_produtos" ON produtos FOR SELECT
  TO authenticated USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "insert_own_produtos" ON produtos;
CREATE POLICY "insert_own_produtos" ON produtos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "update_own_produtos" ON produtos;
CREATE POLICY "update_own_produtos" ON produtos FOR UPDATE
  TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "delete_own_produtos" ON produtos;
CREATE POLICY "delete_own_produtos" ON produtos FOR DELETE
  TO authenticated USING (auth.uid() = usuario_id);

-- ============================================================
-- MOVIMENTACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS movimentacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  produto_id uuid NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  quantidade integer NOT NULL,
  data_movimentacao timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quantidade_positiva CHECK (quantidade > 0)
);

CREATE INDEX IF NOT EXISTS idx_movimentacoes_produto ON movimentacoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes(data_movimentacao DESC);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_usuario ON movimentacoes(usuario_id);

ALTER TABLE movimentacoes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON movimentacoes TO authenticated;

DROP POLICY IF EXISTS "select_own_movimentacoes" ON movimentacoes;
CREATE POLICY "select_own_movimentacoes" ON movimentacoes FOR SELECT
  TO authenticated USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "insert_own_movimentacoes" ON movimentacoes;
CREATE POLICY "insert_own_movimentacoes" ON movimentacoes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "update_own_movimentacoes" ON movimentacoes;
CREATE POLICY "update_own_movimentacoes" ON movimentacoes FOR UPDATE
  TO authenticated USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "delete_own_movimentacoes" ON movimentacoes;
CREATE POLICY "delete_own_movimentacoes" ON movimentacoes FOR DELETE
  TO authenticated USING (auth.uid() = usuario_id);

-- ============================================================
-- FUNCTION: registrar_movimentacao
-- Atomically inserts a movement and updates product stock.
-- Prevents negative stock and validates inputs server-side.
-- SECURITY DEFINER so it can update the product row within
-- the same atomic operation, bypassing RLS safely.
-- ============================================================
CREATE OR REPLACE FUNCTION registrar_movimentacao(
  p_produto_id uuid,
  p_tipo text,
  p_quantidade integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_movimento_id uuid;
  v_novo_estoque integer;
  v_estoque_atual integer;
  v_produto_usuario_id uuid;
BEGIN
  -- Validate tipo
  IF p_tipo NOT IN ('entrada', 'saida') THEN
    RAISE EXCEPTION 'Tipo de movimentação inválido';
  END IF;

  -- Validate quantidade
  IF p_quantidade IS NULL OR p_quantidade <= 0 THEN
    RAISE EXCEPTION 'Quantidade deve ser maior que zero';
  END IF;

  -- Get current stock and verify ownership
  SELECT estoque, usuario_id INTO v_estoque_atual, v_produto_usuario_id
  FROM produtos WHERE id = p_produto_id FOR UPDATE;

  IF v_produto_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Produto não encontrado';
  END IF;

  IF v_produto_usuario_id != auth.uid() THEN
    RAISE EXCEPTION 'Não autorizado';
  END IF;

  -- Calculate new stock
  IF p_tipo = 'entrada' THEN
    v_novo_estoque := v_estoque_atual + p_quantidade;
  ELSE
    v_novo_estoque := v_estoque_atual - p_quantidade;
    IF v_novo_estoque < 0 THEN
      RAISE EXCEPTION 'Saldo insuficiente. Estoque atual: %', v_estoque_atual;
    END IF;
  END IF;

  -- Update product stock
  UPDATE produtos
  SET estoque = v_novo_estoque,
      data_atualizacao = now()
  WHERE id = p_produto_id;

  -- Insert movement record
  INSERT INTO movimentacoes (produto_id, tipo, quantidade, usuario_id)
  VALUES (p_produto_id, p_tipo, p_quantidade, auth.uid())
  RETURNING id INTO v_movimento_id;

  RETURN v_movimento_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION registrar_movimentacao(uuid, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION registrar_movimentacao(uuid, text, integer) TO authenticated;

-- ============================================================
-- FUNCTION: atualizar_data_atualizacao
-- Auto-update data_atualizacao on produtos row update
-- ============================================================
CREATE OR REPLACE FUNCTION atualizar_data_atualizacao()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_produtos_atualizacao ON produtos;
CREATE TRIGGER trigger_produtos_atualizacao
  BEFORE UPDATE ON produtos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_data_atualizacao();
