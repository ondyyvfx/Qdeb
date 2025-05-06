import Navbar from "../components/shared/Navbar";
import UpcomingTournaments from "@/components/shared/UpcomingTournaments";
import DebateClubs from "@/components/shared/DebateClubs";
import TopSpeakersSection from "@/components/shared/TopSpeakersSection";
import Footer from "@/components/shared/Footer";
import ResponsiveHero from "@/components/shared/ResponsiveHero";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <ResponsiveHero />
      <UpcomingTournaments />
      <TopSpeakersSection />
      <DebateClubs />
      <Footer />
    </div>
  );
}
