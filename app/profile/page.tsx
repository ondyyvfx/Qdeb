import Footer from "@/components/shared/Footer";
import ProfileView from "./ProfileView";
import Navbar from "@/components/shared/Navbar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4">
      <Navbar />
      <h1 className="text-3xl font-bold pt-12 text-center">
        Профиль пользователя
      </h1>
      <ProfileView />
      <Footer />
    </div>
  );
}
