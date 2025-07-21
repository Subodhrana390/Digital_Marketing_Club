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
      if (user) {
        const adminStatus = await checkIfUserIsAdmin(user.uid);
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
        if (loading) return;

        if (!user) {
            router.push('/market-verse-admin-login');
            return;
        }

        if (!isAdmin) {
            // Allow access to the login page even if not admin, otherwise it's a loop
            if (pathname !== '/market-verse-admin-login') {
                console.log("Access denied. User is not an admin.");
                router.push('/market-verse-admin-login');
            }
        }

    }, [user, isAdmin, loading, router, pathname]);

    if (loading || !user || !isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        );
    }

    return <>{children}</>;
}
