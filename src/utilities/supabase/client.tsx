import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient>;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Do not create a client during build if envs are missing; create a throwing proxy instead
  // so that imports don't crash the build, but any usage will surface a clear error at runtime.
  const errorMessage =
    "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase = new Proxy({} as any, {
    get() {
      throw new Error(errorMessage);
    },
    apply() {
      throw new Error(errorMessage);
    },
  }) as unknown as ReturnType<typeof createClient>;
}

export { supabase };
