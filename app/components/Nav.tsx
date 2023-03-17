import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';
import type { PotentialSession, TypedSupabaseClient } from '~/routes/__auth';

export default function Nav({
  supabase,
  session,
}: {
  supabase: TypedSupabaseClient;
  session: PotentialSession;
}) {
  const NavItems = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'About',
      path: '/about',
    },
  ];
  const [profilePhoto, setProfilePhoto] = useState('');
  useEffect(() => {
    if (session?.user.id) {
      async function loadProfilePhoto() {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session?.user.id)
          .single();
        setProfilePhoto(data?.avatar_url);
      }
      loadProfilePhoto();
    }
  }, [session?.user.id, supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
  };
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          Watches
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {NavItems.map((navItem, idx) => (
            <li key={idx}>
              <Link to={navItem.path}>{navItem.label}</Link>
            </li>
          ))}
          {!session && (
            <li>
              <Link to="register">Register</Link>
            </li>
          )}
        </ul>
        {session ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {profilePhoto ? (
                  <img
                    src={`https://res.cloudinary.com/tamas-demo/image/upload/f_auto,q_auto,w_100,h_100,c_thumb,g_face,r_max/${profilePhoto}`}
                    alt="Profile"
                  />
                ) : (
                  <img
                    src={`https://res.cloudinary.com/tamas-demo/image/upload/f_auto,q_auto,w_100,h_100,c_thumb,g_face,r_max/avatar`}
                    alt="Profile"
                  />
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/watches/new" className="justify-between">
                  Add new watch
                </Link>
              </li>
              <li>
                <Link to="/watches" className="justify-between">
                  Watches
                </Link>
              </li>
              <li>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown-end">
            <Link to="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
