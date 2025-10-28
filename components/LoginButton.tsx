import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link
      href="/auth/login"
      className="w-10 h-10 rounded-md bg-brand-yellow text-black hover:bg-brand-yellowDark transition grid place-items-center"
      aria-label="Login"
      title="Login"
    >
      {/* icon user */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5A.5.5 0 0 0 3.5 20h17a.5.5 0 0 0 .5-.5C21 16.5 17 14 12 14Z"/>
      </svg>
    </Link>
  );
}
