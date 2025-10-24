import Navbar from "@/components/shared/Navbar";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import ClientCalendar from "./ClientCalendar";
import Footer from "@/components/shared/Footer";
import { cookies } from "next/headers";

type Event = {
  id: number;
  slug: string;
  title: string;
  description: string;
  cost: string;
  city: string;
  start_date: string;
  end_date: string;
  is_registration_open: boolean | null;
  registration_link: string | null;
  categories: string[];
  imageUrl: string;
};

const FALLBACK_API = "http://localhost:4232/api";

export default async function CalendarPage() {
  let events: Event[] = [];

  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== ""
        ? process.env.NEXT_PUBLIC_API_URL
        : FALLBACK_API;

    const apiOrigin = apiBase.replace(/\/api\/?$/, "");

    const accessToken = cookies().get("accessToken")?.value;
    const headers: HeadersInit = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const res = await fetch(`${apiBase}/tournaments`, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store",
      mode: "cors",
      credentials: "include",
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

            const rawImagePath =
              tournament?.imageUrl ||
              tournament?.imageURL ||
              tournament?.photoUrl ||
              tournament?.pictureUrl ||
              "";
            let imageUrl = "/assets/Qback.svg";
            if (typeof rawImagePath === "string") {
              const trimmedPath = rawImagePath.trim();
              if (trimmedPath.length > 0) {
                imageUrl = trimmedPath.startsWith("http")
                  ? trimmedPath
                  : `${apiOrigin}${
                      trimmedPath.startsWith("/") ? "" : "/"
                    }${trimmedPath}`;
              }
            }

            const registrationSource =
              tournament?.active ??
              tournament?.registrationOpen ??
              tournament?.isRegistrationOpen ??
              null;

            let isRegistrationOpen: boolean | null = null;

            if (typeof registrationSource === "boolean") {
              isRegistrationOpen = registrationSource;
            } else if (typeof registrationSource === "number") {
              if (registrationSource === 1) {
                isRegistrationOpen = true;
              } else if (registrationSource === 0) {
                isRegistrationOpen = false;
              }
            } else if (typeof registrationSource === "string") {
              const normalized = registrationSource.trim().toLowerCase();

              if (["true", "open", "yes", "1"].includes(normalized)) {
                isRegistrationOpen = true;
              } else if (["false", "closed", "no", "0"].includes(normalized)) {
                isRegistrationOpen = false;
              }
            }

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
              is_registration_open: isRegistrationOpen,
              registration_link:
                tournament?.tabbycatUrl || tournament?.registrationLink || null,
              categories: categories.map((item) => String(item).toLowerCase()),
              imageUrl,
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
