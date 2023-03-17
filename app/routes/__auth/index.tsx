import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <>
      <h1 className="text-5xl font-bold">The WatchCollection</h1>
      <p className="py-6">Your digital watch collection.</p>
      <Link to="/login">
        <button className="btn btn-primary">Get Started</button>
      </Link>
    </>
  );
}
