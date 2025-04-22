import Hero from "@/components/shared/Hero";
import Navbar from "../components/shared/Navbar";
import UpcomingTournaments from "@/components/shared/UpcomingTournaments";
import TopSpeakersSection from "@/components/shared/TopSpeakerSection";
import DebateClubs from "@/components/shared/DebateClubs";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <UpcomingTournaments />
      <TopSpeakersSection />
      <DebateClubs />
    </div>
  );
}
