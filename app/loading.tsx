export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-white" />
    </div>
  );
}
