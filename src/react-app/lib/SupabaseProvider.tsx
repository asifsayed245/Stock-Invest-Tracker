import { PropsWithChildren, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

type Ctx = {
  session: Session | null;
  loading: boolean;
};

import { createContext, useContext } from "react";
const SupabaseCtx = createContext<Ctx>({ session: null, loading: true });

export function SupabaseProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseCtx.Provider value={{ session, loading }}>
      {children}
    </SupabaseCtx.Provider>
  );
}

export function useSupabaseAuth() {
  return useContext(SupabaseCtx);
}
