"use client";

import React from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useLanguage } from "@/contexts/LanguageContext";
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
  title,
  message,
}) => {
  const { isChecking, isUnauthorized, isNotLoggedIn, user } = useAdminAuth();
  const { t } = useLanguage();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingState message={t.shared.checkingAccess} />
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
        <AccessDeniedMessage
          user={user}
          title={title ?? t.shared.insufficientRights}
          message={message ?? t.shared.adminOnly}
        />
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminOnlyPage;
