import Navbar from "@/components/shared/Navbar";
import { getTopSpeakers } from "../../lib/topspeakers";
import Image from "next/image";
import defaultLogo from "../../public/assets/default/default-avatar.png";

export default async function RatingPage() {
  const speakers = await getTopSpeakers();
  console.log("Speakers: ", speakers);
  const top3 = speakers.slice(0, 3); // Топ-3
  const others = speakers.slice(3); // Остальные

  type Speaker = {
    id: string;
    name: string;
    image: string;
    avg_speech: number;
    elo: number;
    num_tournaments: number;
  };

  const gradients = [
    "from-[rgba(223,159,32,0)] to-[rgba(223,159,32,0.45)]", // золото — 1 место (градиент вверх)
    "from-[rgba(191,191,191,0)] to-[rgba(191,191,191,0.45)]", // серебро — 2 место
    "from-[rgba(185,128,70,0)] to-[rgba(185,128,70,0.45)]", // бронза — 3 место (градиент вверх)
  ];

  return (
    <>
      <Navbar />
      <div className="bg-[#0b0c14] min-h-screen text-white">
        <div className="text-center pt-10 pb-4 text-2xl font-semibold">
          Рейтинг спикеров
        </div>

        {/* Топ 3 */}
        <div className="flex justify-center gap-6 items-end px-4 pb-20">
          <div className="flex justify-center gap-6 items-end px-4 pb-20">
            {[1, 0, 2].map((posIdx, visualIdx) => {
              const speaker = top3[posIdx];
              const gradient = gradients[posIdx];
              const isFirst = posIdx === 0;
              const isSecond = posIdx === 1;
              const isThird = posIdx === 2;

              const medalColor = isFirst
                ? "text-yellow-400"
                : isSecond
                ? "text-gray-400"
                : "text-orange-400";

              const borderColor = isFirst
                ? "border-yellow-500"
                : isSecond
                ? "border-gray-400"
                : "border-orange-400";

              return (
                <div
                  key={speaker.id}
                  className={`relative text-center rounded-2xl p-6 w-64 transition-all duration-300
          ${
            isFirst
              ? `scale-110 z-10 shadow-yellow-400/40 shadow-2xl bg-gradient-to-b ${gradient}`
              : `bg-gradient-to-b ${gradient} shadow-md`
          }`}
                >
                  <div
                    className={`text-5xl font-extrabold absolute -top-10 left-1/2 -translate-x-1/2 ${medalColor}`}
                  >
                    #{posIdx + 1}
                  </div>
                  <div
                    className={`w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 ${borderColor}`}
                  >
                    <Image
                      src={speaker.image || defaultLogo}
                      alt={speaker.name}
                      width={128}
                      height={128}
                      className="h-30 w-30 rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-semibold">{speaker.name}</h2>
                  <p className="text-sm text-gray-300 mb-2">
                    Средний балл: {speaker.avg_speech.toFixed(1)}
                  </p>
                  <div className="text-sm text-gray-400">
                    <div>ELO: {speaker.elo}</div>
                    <div>Турниров: {speaker.num_tournaments}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Остальные спикеры - просто карточками */}
        <div className="max-w-5xl mx-auto px-4 pb-10">
          {others.map((speaker: Speaker, index: number) => (
            <div
              key={speaker.id}
              className="bg-[#13151f] mb-4 p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-gray-400">
                  #{index + 4}
                </span>
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={speaker.image || defaultLogo}
                    alt={speaker.name}
                    width={56}
                    height={56}
                  />
                </div>
                <div>
                  <div className="font-semibold">{speaker.name}</div>
                  <div className="text-sm text-gray-400">
                    ELO: {speaker.elo}, Средний балл:{" "}
                    {speaker.avg_speech.toFixed(1)}, Турниров:{" "}
                    {speaker.num_tournaments}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
