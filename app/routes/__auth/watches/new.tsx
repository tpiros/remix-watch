import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import createServerClient from 'utils/supabase';

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const brand = String(form.get('brand'));
  const model = String(form.get('model'));
  const reference = String(form.get('reference'));

  const response = new Response();
  const supabase = createServerClient({ request, response });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const fields = { user_id: user?.id, brand, model, reference };
  if (brand.length < 3 || model.length < 3 || reference.length < 3) {
    return json(
      {
        localError:
          'Brand, model and reference must all be filled out with a minimum of 3 characters',
      },
      { status: 400 }
    );
  }
  await supabase.from('watches').insert(fields);
  return redirect(`/watches`, {
    headers: response.headers,
  });
};

export default function NewWatchRoute() {
  const actionData = useActionData<typeof action>();
  return (
    <>
      {actionData?.localError ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <span>{actionData?.localError}</span>
          </div>
        </div>
      ) : (
        ''
      )}
      <h1 className="text-5xl font-bold m-4">
        Add a new watch to the collection
      </h1>
      <div className="py-6">
        <form method="post">
          <div className="form-control">
            <label className="input-group input-group-vertical my-4">
              <span>Brand</span>
              <input
                type="text"
                className="input input-bordered"
                name="brand"
              />
            </label>
            <label className="input-group input-group-vertical my-4">
              <span>Model</span>
              <input
                type="text"
                className="input input-bordered"
                name="model"
              />
            </label>
            <label className="input-group input-group-vertical my-4">
              <span>Reference</span>
              <input
                type="text"
                className="input input-bordered"
                name="reference"
              />
            </label>
          </div>
          <button type="submit" className="btn btn-warning m-4">
            Save
          </button>
        </form>
      </div>
    </>
  );
}
