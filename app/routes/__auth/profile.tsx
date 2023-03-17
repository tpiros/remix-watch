import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import createServerClient from 'utils/supabase';

import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import UploadWidget from '~/components/UploadWidget';
import { useEffect, useState } from 'react';
import CldImage from '~/components/CldImage';

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerClient({ request, response });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/?index', {
      headers: response.headers,
    });
  }

  let { data: profileData } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user?.id)
    .single();

  return json(
    { user, session, profileData },
    {
      headers: response.headers,
    }
  );
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const name = String(form.get('name'));
  const publicId = String(form.get('publicIdValue'));

  const response = new Response();
  const supabase = createServerClient({ request, response });

  const { data: user, error } = await supabase.auth.getUser();

  if (!error) {
    const dataToInsert = {
      id: user?.user?.id,
      updated_at: new Date(),
      full_name: name,
      avatar_url: publicId,
    };

    const result = await supabase.from('profiles').upsert(dataToInsert);
    console.log(result);
  }
  return redirect('/profile');
};

export default function Profile() {
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'uw';
    script.src = 'https://upload-widget.cloudinary.com/2.4.4/global/all.js';
    document.body.appendChild(script);
    return () => document.getElementById('uw')?.remove();
  }, []);
  const { user, session, profileData } = useLoaderData<typeof loader>();
  const [publicId, setPublicId] = useState(null);

  return (
    <>
      <>
        <h1 className="text-5xl font-bold">Profile</h1>
        <div className="py-6">
          <div>
            {publicId ? <CldImage publicId={publicId} /> : ''}
            <UploadWidget
              callback={(error: Error, result: any) => {
                if (!error && result && result.event === 'success') {
                  setPublicId(result.info.public_id);
                }
              }}
            />
          </div>
          <form method="post">
            <input type="hidden" name="publicIdValue" value={publicId ?? ''} />
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Name</span>
              </label>
              <label className="input-group input-group-vertical">
                <span>Name</span>
                <input
                  type="text"
                  className="input input-bordered"
                  name="name"
                />
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-warning"
              disabled={!publicId}
            >
              Update profile
            </button>
          </form>
        </div>
      </>
      <div className="mockup-code text-left w-full">
        <pre>
          <code>{JSON.stringify({ session }, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify({ user }, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify({ profileData }, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}
