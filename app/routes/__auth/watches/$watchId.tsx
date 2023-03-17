import { redirect } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useCatch, useLoaderData, useParams } from '@remix-run/react';
import createServerClient from 'utils/supabase';

export const loader = async ({ request, params }: LoaderArgs) => {
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
  const { data } = await supabase
    .from('watches')
    .select()
    .eq('id', params.watchId)
    .single();

  if (!data) {
    throw new Response('Watch not found.', {
      status: 404,
    });
  }
  return json(
    { watch: data, session },
    {
      headers: response.headers,
    }
  );
};

export default function WatchRoute() {
  const { watch } = useLoaderData<typeof loader>();
  return (
    <>
      <h1 className="text-5xl font-bold">The WatchCollection</h1>
      <div className="card w-96 bg-base-100 shadow-xl my-6">
        <div className="card-body">
          <h2 className="card-title">
            {watch.brand} {watch.model}
          </h2>
          <p>Ref: {watch?.reference}</p>
        </div>
      </div>
      <Link to="/watches" className="text-blue-700 hover:underline">
        Go back to the collection
      </Link>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <div>Watch "{params.watchId}" doesn't exist.</div>;
  }

  throw new Error(`Unhandled error: ${caught.status}`);
}
