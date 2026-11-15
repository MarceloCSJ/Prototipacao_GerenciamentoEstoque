/*
# Add helper function: get_last_movement_dates

## Overview
Adds a PL/pgSQL function that returns the most recent movement date
for a list of product IDs. Used by the frontend to compute whether
products are "stale" (no movement in 60+ days) without fetching
all movement records.

## Function
### get_last_movement_dates
- Input: p_produto_ids (uuid[]) — array of product IDs
- Output: table with produto_id (uuid) and last_date (timestamptz | null)
- SECURITY INVOKER so RLS on movimentacoes applies — users only see
  movement dates for products they own
- Revoked from anon, granted to authenticated
*/

CREATE OR REPLACE FUNCTION get_last_movement_dates(p_produto_ids uuid[])
RETURNS TABLE(produto_id uuid, last_date timestamptz)
LANGUAGE plpgsql
SECURITY INVOKER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT m.produto_id, MAX(m.data_movimentacao) AS last_date
  FROM movimentacoes m
  WHERE m.produto_id = ANY(p_produto_ids)
  GROUP BY m.produto_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_last_movement_dates(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_last_movement_dates(uuid[]) TO authenticated;
