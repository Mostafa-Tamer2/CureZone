import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient>;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Graceful mock to prevent 500s when env vars are missing (e.g., on Vercel misconfig).
  // This returns safe defaults so pages render without crashing.
  const mockError = {
    message:
      "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  } as unknown as Error;

  type MockResult<T = unknown> = Promise<{
    data: T | null;
    error: Error | null;
    count?: number | null;
  }> & {
    // Allow chaining without type headaches
    select: (..._args: unknown[]) => MockResult<T>;
    eq: (..._args: unknown[]) => MockResult<T>;
    in: (..._args: unknown[]) => MockResult<T>;
    order: (..._args: unknown[]) => MockResult<T>;
    ilike: (..._args: unknown[]) => MockResult<T>;
    limit: (..._args: unknown[]) => MockResult<T>;
    single: (..._args: unknown[]) => MockResult<T>;
    delete: (..._args: unknown[]) => MockResult<T>;
    update: (..._args: unknown[]) => MockResult<T>;
    insert: (..._args: unknown[]) => MockResult<T>;
    or: (..._args: unknown[]) => MockResult<T>;
    // Thenable so `await` works after any chain call
    then: <R>(
      onFulfilled: (value: {
        data: T | null;
        error: Error | null;
        count?: number | null;
      }) => R
    ) => Promise<R>;
    catch: <R>(onRejected: (reason: unknown) => R) => Promise<R>;
    finally: (onFinally?: () => void) => Promise<void>;
  };

  const createMockResult = <T,>(
    data: T | null = [] as unknown as T,
    error: Error | null = mockError
  ): MockResult<T> => {
    const base = Promise.resolve({ data, error, count: 0 });
    const chain = {
      select: () => chain,
      eq: () => chain,
      in: () => chain,
      order: () => chain,
      ilike: () => chain,
      limit: () => chain,
      single: () => chain,
      delete: () => chain,
      update: () => chain,
      insert: () => chain,
      or: () => chain,
      then: base.then.bind(base),
      catch: base.catch.bind(base),
      finally: base.finally.bind(base),
    } as unknown as MockResult<T>;
    return chain;
  };

  // Minimal mock of the Supabase client shape used by the app
  const mockClient = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: mockError }),
    },
    from: () => createMockResult(),
  } as unknown as ReturnType<typeof createClient>;

  supabase = mockClient;
}

export { supabase };
