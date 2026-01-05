-- Create storage bucket for digital product downloads
INSERT INTO storage.buckets (id, name, public)
VALUES ('downloads', 'downloads', false);

-- Create RLS policy to allow authenticated users to download files for products they purchased
CREATE POLICY "Authenticated users can download purchased products"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'downloads'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.purchase_items pi
    JOIN public.purchases p ON pi.purchase_id = p.id
    JOIN public.profiles pr ON p.email = pr.email
    WHERE pr.user_id = auth.uid()
    AND pi.product_handle = SPLIT_PART(name, '/', 1)
  )
);