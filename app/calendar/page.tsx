import Navbar from "@/components/shared/Navbar";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import ClientCalendar from "./ClientCalendar";
import Footer from "@/components/shared/Footer";

type Event = {
  id: number;
  slug: string;
  title: string;
  description: string;
  cost: string;
  city: string;
  start_date: string;
  end_date: string;
  is_registration_open: boolean;
  registration_link: string | null;
  categories: string[];
};

const FALLBACK_API = "http://localhost:4232/api";

export default async function CalendarPage() {
  let events: Event[] = [];

  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== ""
        ? process.env.NEXT_PUBLIC_API_URL
        : FALLBACK_API;

    const res = await fetch(`${apiBase}/tournaments`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(
        "Failed to load tournaments for calendar:",
        res.status,
        text
      );
    } else {
      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        console.warn(
          "Unexpected content type when loading tournaments for calendar:",
          contentType
        );
      } else {
        const data: unknown = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.results)
          ? (data as any).results
          : [];

        events = (list as any[])
          .map((tournament, index) => {
            const rawSlug =
              tournament?.slug ||
              (tournament?.id !== undefined ? String(tournament.id) : "");
            const startDate =
              tournament?.date ||
              tournament?.startDate ||
              tournament?.eventDate ||
              "";
            const endDate =
              tournament?.date ||
              tournament?.endDate ||
              tournament?.eventDate ||
              startDate;

            if (!rawSlug || !startDate) {
              return null;
            }

            const numericId = Number.isFinite(Number(tournament?.id))
              ? Number(tournament.id)
              : Number.parseInt(rawSlug.replace(/[^0-9]/g, ""), 10);
            const fallbackId = Number.isFinite(numericId)
              ? numericId
              : index;

            const feeValue =
              typeof tournament?.fee === "number"
                ? tournament.fee
                : Number.parseFloat(tournament?.fee ?? "0");

            const categories = [
              tournament?.level,
              tournament?.format,
            ].filter(Boolean) as string[];

            return {
              id: fallbackId,
              slug: rawSlug,
              title: tournament?.name || tournament?.title || rawSlug,
              description: tournament?.description || "",
              cost: Number.isFinite(feeValue) ? feeValue.toString() : "0",
              city:
                tournament?.organizerName ||
                tournament?.city ||
                "Location to be announced",
              start_date: startDate,
              end_date: endDate,
              is_registration_open: Boolean(
                tournament?.active ?? tournament?.registrationOpen ?? false
              ),
              registration_link:
                tournament?.tabbycatUrl || tournament?.registrationLink || null,
              categories: categories.map((item) => String(item).toLowerCase()),
            } as Event;
          })
          .filter((item): item is Event => Boolean(item));
      }
    }
  } catch (error) {
    console.error("CalendarPage: failed to fetch tournaments:", error);
    events = [];
  }

  const groupedByMonth = events.reduce((acc: Record<string, Event[]>, event) => {
    const month = format(new Date(event.start_date), "LLLL yyyy", {
      locale: ru,
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {});

  const categories = ["students", "offline", "online"];

  return (
    <div>
      <Navbar />
      <div className="mx-3 md:mx-10 xl:mx-19 my-15">
        <h1 className="text-3xl font-bold mb-6">Календарь турниров</h1>
        <ClientCalendar events={groupedByMonth} categories={categories} />
      </div>
      <Footer />
    </div>
  );
}
