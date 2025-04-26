import EditProfileForm from "./EditProfileForm";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-4">
      <h1 className="text-3xl font-bold  text-center">
        Редактирование профиля
      </h1>
      <EditProfileForm />
    </div>
  );
}
