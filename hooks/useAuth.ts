import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

type AuthState = 'checking' | 'authorized' | 'not_logged_in';

export const useAuth = () => {
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

        setAuthState('authorized');
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        setAuthState('not_logged_in');
        toast.error("Ошибка при проверке авторизации");
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
    isNotLoggedIn: authState === 'not_logged_in'
  };
};

