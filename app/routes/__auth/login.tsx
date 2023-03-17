import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import createServerClient from '../../../utils/supabase';

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerClient({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }
  return json({});
};
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = String(form.get('email'));
  const password = String(form.get('password'));

  if (typeof email !== 'string' || typeof password !== 'string') {
    console.log('error!!!');
  }

  const response = new Response();
  const supabase = createServerClient({ request, response });
  const auth = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (auth.error) {
    return json({ localError: auth.error }, { status: 400 });
  }

  return redirect('/watches', {
    headers: response.headers,
  });
};
export default function Login() {
  const actionData = useActionData<typeof action>();
  return (
    <>
      <h1 className="text-5xl font-bold p-4">Login</h1>
      {actionData?.localError ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <span>{actionData?.localError.message}</span>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="py-6">
        <form method="post">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Email</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Email</span>
              <input
                type="text"
                className="input input-bordered"
                name="email"
              />
            </label>
            <label className="label">
              <span className="label-text">Your Password</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input
                type="password"
                className="input input-bordered"
                name="password"
              />
            </label>
          </div>
          <button type="submit" className="btn btn-warning m-4">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
