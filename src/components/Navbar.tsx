"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // För att förhindra hydration mismatch (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-blue-600 shadow-md text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          Kursvinnare
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:underline">
            Hem
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className={`hover:underline ${
                  pathname === "/dashboard" ? "font-bold underline" : ""
                }`}
              >
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="hover:underline">
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="hover:underline">
                Registrera
              </Link>
              <Link href="/login" className="hover:underline">
                Logga in
              </Link>
            </>
          )}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-blue-600 text-white space-y-4 p-6"
            >
              <Link href="/" className="block">
                Hem
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="block">
                    Dashboard
                  </Link>
                  <button onClick={() => signOut()} className="block">
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="block">
                    Registrera
                  </Link>
                  <Link href="/login" className="block">
                    Logga in
                  </Link>
                </>
              )}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="block mt-4"
                >
                  {theme === "dark" ? "Ljust läge" : "Mörkt läge"}
                </button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
