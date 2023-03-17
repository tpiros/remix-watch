import { json } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData } from '@remix-run/react';
import { createBrowserClient } from '@supabase/auth-helpers-remix';
import { useEffect, useState } from 'react';
import Nav from '~/components/Nav';
import createServerClient from '../../utils/supabase';

import type { LoaderArgs } from '@remix-run/node';
import type { Session, SupabaseClient } from '@supabase/auth-helpers-remix';
import type { Database } from '../../utils/database_types';

export type TypedSupabaseClient = SupabaseClient<Database>;
export type PotentialSession = Session | null;
export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient;
  session: PotentialSession;
};

export const loader = async ({ request }: LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_KEY!,
  };

  const response = new Response();

  const supabase = createServerClient({ request, response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json(
    {
      env,
      session,
    },
    {
      headers: response.headers,
    }
  );
};

export default function Supabase() {
  const { env, session } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        fetcher.submit(null, {
          method: 'post',
          action: '/handle-supabase-auth',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, fetcher]);

  return (
    <>
      <Nav supabase={supabase} session={session} />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <Outlet context={{ supabase, session }} />
          </div>
        </div>
      </div>
    </>
  );
}
