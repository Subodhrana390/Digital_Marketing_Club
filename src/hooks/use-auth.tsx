
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged } from '@/services/auth';
import type { User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import Loading from '@/app/loading';
import { checkIfUserIsAdmin } from '@/services/admins';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setUser(user);
      if (user && user.email) {
        const adminStatus = await checkIfUserIsAdmin(user.email);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Don't do anything while auth state is loading
        if (loading) {
            return;
        }

        // Check if the current route is an admin route
        const isAccessingAdminRoute = pathname.startsWith('/admin');

        // If trying to access an admin route...
        if (isAccessingAdminRoute) {
            // and is not a logged-in admin, redirect to login page.
            if (!user || !isAdmin) {
                router.push('/market-verse-admin-login');
            }
        }
    }, [user, isAdmin, loading, router, pathname]);

    // While loading, or if the user is not yet authenticated for an admin route, show a loading screen.
    if (loading || (pathname.startsWith('/admin') && (!user || !isAdmin))) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        );
    }
    
    // Once checks are passed, render the children
    return <>{children}</>;
}
