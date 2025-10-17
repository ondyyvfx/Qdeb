import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User } from "@/stores/useUserStore";
import { formatUserRoles } from "@/lib/auth-utils";

interface AccessDeniedMessageProps {
  user: User | null;
  title?: string;
  message?: string;
  showRoles?: boolean;
  redirectPath?: string;
  redirectButtonText?: string;
}

export const AccessDeniedMessage: React.FC<AccessDeniedMessageProps> = ({
  user,
  title = "Недостаточно прав",
  message = "У вас нет доступа к этой странице",
  showRoles = true,
  redirectPath = "/",
  redirectButtonText = "Вернуться на главную",
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-yellow-500/30 transition-all duration-300">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">
            {title}
          </h2>
          <p className="text-gray-400 mb-4">{message}</p>
          {showRoles && (
            <p className="text-sm text-gray-500 mb-6">
              Ваши роли: {formatUserRoles(user)}
            </p>
          )}
          <Button
            onClick={() => router.push(redirectPath)}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer warning-button"
          >
            {redirectButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedMessage;
