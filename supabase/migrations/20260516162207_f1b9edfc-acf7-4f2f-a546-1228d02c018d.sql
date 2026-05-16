CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0 AND length(name) <= 100
    AND length(trim(email)) > 0 AND length(email) <= 255
    AND length(trim(message)) > 0 AND length(message) <= 2000
  );

CREATE POLICY "Only owner can view feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lavishkumar1232@gmail.com');