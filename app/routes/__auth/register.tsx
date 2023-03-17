import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import createServerClient from 'utils/supabase';

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = String(form.get('email'));
  const password = String(form.get('password'));

  const response = new Response();
  const supabase = createServerClient({ request, response });

  const { data: user, error } = await supabase.auth.signUp({ email, password });

  if (typeof email !== 'string' || typeof password !== 'string') {
    return json(
      { localError: 'Form not submitted correctly' },
      { status: 400 }
    );
  }

  if (typeof email !== 'string' || email.length < 3) {
    return json(
      { localError: 'Username should be more than 3 characters' },
      { status: 400 }
    );
  }

  if (typeof password !== 'string' || password.length < 5) {
    return json(
      { localError: 'Password should be more than 5 characters' },
      { status: 400 }
    );
  }

  if (!error) {
    const dataToInsert = {
      id: user?.user?.id,
      updated_at: new Date(),
    };

    await supabase.from('profiles').upsert(dataToInsert);
    return redirect('/');
  } else {
    console.log('error', error);
    return json(
      { localError: `User with email "${email}" already exists` },
      { status: 400 }
    );
  }
};
export default function Register() {
  const actionData = useActionData<typeof action>();
  return (
    <>
      <h1 className="text-5xl font-bold p-4">Register</h1>
      {actionData?.localError ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <span>{actionData?.localError}</span>
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
            Register
          </button>
        </form>
      </div>
    </>
  );
}
