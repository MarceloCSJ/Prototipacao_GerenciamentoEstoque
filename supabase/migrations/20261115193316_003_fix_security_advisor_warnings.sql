/*
# Fix security advisor findings

## Overview
Fixes two advisor warnings:
1. `atualizar_data_atualizacao` trigger function has mutable search_path
2. `registrar_movimentacao` SECURITY DEFINER function is callable by authenticated (expected behavior, but search_path warning on trigger function needs fix)

## Changes
1. Recreate `atualizar_data_atualizacao` with `SET search_path = public`
2. The `registrar_movimentacao` SECURITY DEFINER warning is expected — this function
   is intentionally callable by authenticated users (it's the RPC for stock movements).
   The function already validates ownership internally via `auth.uid()` checks.
*/

DROP TRIGGER IF EXISTS trigger_produtos_atualizacao ON produtos;
DROP FUNCTION IF EXISTS atualizar_data_atualizacao();

CREATE OR REPLACE FUNCTION atualizar_data_atualizacao()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_produtos_atualizacao
  BEFORE UPDATE ON produtos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_data_atualizacao();
