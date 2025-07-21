
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged } from '@/services/auth';
import type { User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import Loading from '@/app/loading';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean; // Keep for compatibility, but will always be true if user exists
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Simplified logic: if a user is logged in, they are considered an admin.
  const isAdmin = !!user;

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isAccessingAdminRoute = pathname.startsWith('/admin');

    useEffect(() => {
        // Don't do anything while auth state is loading
        if (loading) {
            return;
        }

        // If trying to access an admin route and is not logged in, redirect to login page.
        if (isAccessingAdminRoute && !user) {
            router.push('/dmc/login');
        }
    }, [user, loading, router, pathname, isAccessingAdminRoute]);

    // While loading, or if the user is not yet authenticated for an admin route, show a loading screen.
    if (loading || (isAccessingAdminRoute && !user)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        );
    }
    
    // Once checks are passed, render the children
    return <>{children}</>;
}
