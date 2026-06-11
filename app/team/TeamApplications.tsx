"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

type TeamInfo = {
  id: number;
  name: string;
  code: string;
  size: number;
  leader: boolean;
};

type TeamApplicationsProps = {
  team: TeamInfo;
};

type ApplicationField = {
  id: number;
  name: string;
  value: string;
};

type ApplicationResponse = {
  id: number;
  tournamentName: string;
  tournamentSlug: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt?: string;
  submittedBy?: {
    id: number;
    username: string;
    fullName: string;
    email?: string;
  };
  fields?: ApplicationField[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

const statusBadgeClass: Record<ApplicationResponse["status"], string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  APPROVED: "bg-green-500/20 text-green-300 border-green-500/30",
  REJECTED: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function TeamApplications({ team }: TeamApplicationsProps) {
  const { t } = useLanguage();
  const statusLabel: Record<ApplicationResponse["status"], string> = {
    PENDING: t.team.statusPending,
    APPROVED: t.team.statusApproved,
    REJECTED: t.team.statusRejected,
  };
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | ApplicationResponse["status"]
  >("ALL");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = Cookies.get("accessToken");
        if (!token) {
          setError(t.team.couldNotIdentifyUser);
          setApplications([]);
          return;
        }

        const response = await fetch(
          `${API_URL}/teams/${team.id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(t.team.couldNotGetApplications);
        }

        const data: ApplicationResponse[] = await response.json();
        setApplications(data);
      } catch (err) {
        console.error("Ошибка загрузки заявок команды:", err);
        setError(
          err instanceof Error ? err.message : t.team.couldNotLoadApplications
        );
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (team.id) {
      loadApplications();
    }
  }, [team.id, t]);

  const filteredApplications = useMemo(() => {
    if (selectedStatus === "ALL") {
      return applications;
    }
    return applications.filter((app) => app.status === selectedStatus);
  }, [applications, selectedStatus]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(t.team.dateLocale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {t.team.applicationsTitle}
          </h2>
          <p className="text-gray-400 mt-1">
            {applications.length > 0
              ? t.team.applicationsCount(applications.length)
              : t.team.noApplicationsYet}
          </p>
        </div>
        {applications.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{t.team.statusFilterLabel}</span>
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value as typeof selectedStatus)
              }
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            >
              <option value="ALL">{t.team.filterAll}</option>
              <option value="PENDING">{t.team.filterPending}</option>
              <option value="APPROVED">{t.team.filterApproved}</option>
              <option value="REJECTED">{t.team.filterRejected}</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-sm text-gray-400">
            {t.team.loadingApplications}
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-sm text-red-300">
            {error}
          </CardContent>
        </Card>
      ) : filteredApplications.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white mb-1">
              {t.team.noApplicationsWithStatus}
            </h3>
            <p className="text-sm text-gray-400">
              {t.team.applicationWillAppear}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            return (
              <Card
                key={application.id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-white text-xl">
                        {application.tournamentName}
                      </CardTitle>
                      <p className="text-sm text-gray-400">
                        {t.team.submittedOn(formatDate(application.createdAt))}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${statusBadgeClass[application.status]} border`}
                    >
                      {statusLabel[application.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.fields && application.fields.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-white">
                        {t.team.providedData}
                      </h4>
                      <div className="grid gap-2">
                        {application.fields.map((field) => (
                          <div
                            key={field.id}
                            className="flex flex-col rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
                          >
                            <span className="text-gray-400">{field.name}</span>
                            <span className="text-white">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {application.submittedBy && (
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
                      <p className="text-white font-medium">
                        {t.team.submittedByLabel(
                          application.submittedBy.fullName
                        )}
                      </p>
                      <p className="text-gray-400">
                        @{application.submittedBy.username} ·{" "}
                        {application.submittedBy.email ?? t.team.emailNotSpecified}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-6 space-y-2 text-sm text-gray-300">
          <h3 className="text-white font-medium">{t.team.howItWorksTitle}</h3>
          <p>{t.team.howItWorksText}</p>
        </CardContent>
      </Card>
    </div>
  );
}
