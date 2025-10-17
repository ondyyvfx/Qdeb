import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LoginRequiredMessageProps {
  message?: string;
  redirectPath?: string;
}

export const LoginRequiredMessage: React.FC<LoginRequiredMessageProps> = ({
  message = "Необходимо войти в систему для доступа к этой странице",
  redirectPath = "/login",
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-500/30 transition-all duration-300">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            Доступ запрещен
          </h2>
          <p className="text-gray-400 mb-4">{message}</p>
          <div className="mt-6">
            <Button
              onClick={() => router.push(redirectPath)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer error-button"
            >
              Войти в систему
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredMessage;
