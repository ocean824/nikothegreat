-- Block all user inserts on purchases (webhook uses service role which bypasses RLS)
CREATE POLICY "No direct user inserts on purchases"
ON public.purchases
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block all user inserts on purchase_items
CREATE POLICY "No direct user inserts on purchase_items"
ON public.purchase_items
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block all user updates on purchases
CREATE POLICY "No direct user updates on purchases"
ON public.purchases
FOR UPDATE
TO authenticated
USING (false);

-- Block all user updates on purchase_items
CREATE POLICY "No direct user updates on purchase_items"
ON public.purchase_items
FOR UPDATE
TO authenticated
USING (false);

-- Block all user deletes on purchases
CREATE POLICY "No direct user deletes on purchases"
ON public.purchases
FOR DELETE
TO authenticated
USING (false);

-- Block all user deletes on purchase_items
CREATE POLICY "No direct user deletes on purchase_items"
ON public.purchase_items
FOR DELETE
TO authenticated
USING (false);