import React from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import LoadingState from "./LoadingState";
import LoginRequiredMessage from "./LoginRequiredMessage";
import AccessDeniedMessage from "./AccessDeniedMessage";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AdminOnlyPageProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
}

export const AdminOnlyPage: React.FC<AdminOnlyPageProps> = ({
  children,
  title = "Недостаточно прав",
  message = "Только администраторы могут получить доступ к этой странице",
}) => {
  const { isChecking, isUnauthorized, isNotLoggedIn, user } = useAdminAuth();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingState message="Проверка прав доступа..." />
        <Footer />
      </div>
    );
  }

  if (isNotLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoginRequiredMessage />
        <Footer />
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AccessDeniedMessage user={user} title={title} message={message} />
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminOnlyPage;
