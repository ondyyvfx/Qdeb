import Hero from "@/components/shared/Hero";
import Navbar from "../components/shared/Navbar";
import UpcomingTournaments from "@/components/shared/UpcomingTournaments";
import DebateClubs from "@/components/shared/DebateClubs";
import TopSpeakersSection from "@/components/shared/TopSpeakersSection";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <UpcomingTournaments />
      <TopSpeakersSection />
      <DebateClubs />
      <Footer />
    </div>
  );
}
