-- Prevent profile deletion entirely
CREATE POLICY "Users cannot delete their profile"
ON public.profiles
FOR DELETE
USING (false);