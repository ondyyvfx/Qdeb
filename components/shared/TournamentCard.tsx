import React from "react";
import Link from "next/link";
import { Calendar, DollarSign, ExternalLink, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Qlogo from "@/public/assets/Qclub.svg";

type TournamentCardProps = {
    id: number;
    slug: string;
    title: string;
    start_date: string;
    end_date: string;
    cost: number;
    location: string;
    registrationlink: string | null;
    backgroundUrl: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

const parseDate = (value: string) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateRange = (start: string, end: string) => {
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (startDate && endDate) {
        const sameDay = startDate.toDateString() === endDate.toDateString();
        if (sameDay) {
            return dateFormatter.format(startDate);
        }
        return `${dateFormatter.format(startDate)} — ${dateFormatter.format(
            endDate
        )}`;
    }

    if (startDate) {
        return dateFormatter.format(startDate);
    }

    if (endDate) {
        return dateFormatter.format(endDate);
    }

    return "Dates to be announced";
};

const formatCost = (value: number) => {
    if (Number.isFinite(value) && value > 0) {
        return `${Math.round(value)} ₸`;
    }
    return "Free";
};

const TournamentCard: React.FC<TournamentCardProps> = ({
    slug,
    title,
    start_date,
    end_date,
    cost,
    location,
    registrationlink,
    backgroundUrl,
}) => {
    const imageSrc = backgroundUrl || Qlogo.src;
    const ctaHref = registrationlink || `/tournaments/${slug}`;
    const isExternalLink =
        typeof registrationlink === "string" &&
        /^https?:\/\//i.test(registrationlink);
    const ctaLabel = registrationlink ? "Register" : "View details";

    return (
        <Card
            className="bg-primary border-none flex flex-col gap-6 p-10 text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
            style={{
                backgroundImage: ` url(${Qlogo.src})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right bottom",
                backgroundSize: "40%",
            }}
        >
            <div className="flex w-full gap-4 items-start">
                <img
                    src={imageSrc}
                    alt={title}
                    className="h-20 w-20 rounded-lg border border-white/30 object-cover shadow-md"
                />
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold leading-tight">
                        {title}
                    </h3>
                    <div className="flex flex-col gap-2 text-sm text-white/80">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-white/60" />
                            {formatDateRange(start_date, end_date)}
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-white/60" />
                            {location || "Location to be announced"}
                        </span>
                        <span className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-white/60" />
                            {formatCost(cost)}
                        </span>
                    </div>
                </div>
            </div>

            <Button
                variant="secondary"
                className="mt-2 h-12 w-[150px] rounded-lg border border-white/50 bg-primary/20 text-white hover:bg-primary/35"
                asChild
            >
                <Link
                    href={ctaHref}
                    target={isExternalLink ? "_blank" : undefined}
                    rel={isExternalLink ? "noopener noreferrer" : undefined}
                >
                    <span>{ctaLabel}</span>
                    {isExternalLink && <ExternalLink className="h-4 w-4" />}
                </Link>
            </Button>
        </Card>
    );
};

export default TournamentCard;
