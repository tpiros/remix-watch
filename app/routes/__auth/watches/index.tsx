import { json, redirect } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import createServerClient from 'utils/supabase';

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerClient({ request, response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/?index', {
      headers: response.headers,
    });
  }
  const { data } = await supabase.from('watches').select();

  return json(
    { watches: data ?? [], session },
    {
      headers: response.headers,
    }
  );
};

export default function WatchesIndexRoute() {
  const { watches } = useLoaderData<typeof loader>();
  return (
    <>
      <h1 className="text-5xl font-bold">The WatchCollection</h1>
      {watches.length === 0 && <p>No watches added yet.</p>}
      {watches.map((watch) => (
        <div key={watch.id} className="card w-96 bg-base-100 shadow-xl my-6">
          <div className="card-body">
            <h2 className="card-title">
              {watch.brand} {watch.model}
            </h2>
            <div className="card-actions justify-end">
              <Link to={String(watch.id)}>
                <button className="btn btn-primary">See details</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
