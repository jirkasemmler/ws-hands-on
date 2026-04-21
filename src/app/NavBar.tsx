"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <span className="font-bold text-lg">Workshop Dashboard</span>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          Dashboard
        </Link>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
          Admin
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-gray-500">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Odhlásit
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
            >
              Přihlásit se
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
