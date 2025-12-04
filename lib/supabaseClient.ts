import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Використання токена Clerk для RLS на edge/API route
export async function supabaseWithAuth() {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          options.headers = {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : "",
          };
          return fetch(url, options);
        },
      },
    }
  );
}
