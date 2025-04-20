import Hero from "@/components/shared/Hero";
import Navbar from "../components/shared/Navbar";
import UpcomingTournaments from "@/components/shared/UpcomingTournaments";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <UpcomingTournaments />
    </div>
  );
}
