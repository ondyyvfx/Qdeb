import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import { isAdmin } from '@/lib/auth-utils';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

type AuthState = 'checking' | 'authorized' | 'unauthorized' | 'not_logged_in';

export const useAdminAuth = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [authState, setAuthState] = useState<AuthState>('checking');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("accessToken");
        
        if (!token) {
          setAuthState('not_logged_in');
          toast.error("Необходимо войти в систему");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        // Если пользователь еще не загружен, ждем немного и проверяем снова
        if (!user) {
          setTimeout(checkAuth, 500);
          return;
        }

        // Проверяем роли пользователя
        if (!isAdmin(user)) {
          setAuthState('unauthorized');
          console.log("User roles:", user.roles);
          console.log("User does not have ROLE_ADMIN");
          return;
        }

        setAuthState('authorized');
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        setAuthState('not_logged_in');
        toast.error("Ошибка при проверке прав доступа");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    checkAuth();
  }, [user, router]);

  return {
    authState,
    user,
    isAuthorized: authState === 'authorized',
    isChecking: authState === 'checking',
    isUnauthorized: authState === 'unauthorized',
    isNotLoggedIn: authState === 'not_logged_in'
  };
};
