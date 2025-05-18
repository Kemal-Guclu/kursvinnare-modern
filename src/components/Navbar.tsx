"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-blue-600">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white">
            Hem
          </Link>
        </li>
        {session ? (
          <>
            <li>
              <Link href="/dashboard" className="text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="text-white hover:text-gray-300"
              >
                Logga ut
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/register" className="text-white">
                Registrera
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white">
                Logga in
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
