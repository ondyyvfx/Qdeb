// import Navbar from "@/components/shared/Navbar";
// import { getTopSpeakers } from "../../lib/topspeakers";
// import Image from "next/image";
// import defaultLogo from "../../public/assets/default/default-avatar.png";

// export default async function RatingPage() {
//   const speakers = await getTopSpeakers();
//   // console.log("Speakers: ", speakers);
//   const top3 = speakers.slice(0, 3); // Топ-3
//   const others = speakers.slice(3); // Остальные

//   type Speaker = {
//     id: string;
//     name: string;
//     image: string;
//     avg_speech: number;
//     elo: number;
//     num_tournaments: number;
//   };

//   const gradients = [
//     "from-[rgba(223,159,32,0)] to-[rgba(223,159,32,0.45)]", // золото — 1 место
//     "from-[rgba(191,191,191,0)] to-[rgba(191,191,191,0.45)]", // серебро — 2 место
//     "from-[rgba(185,128,70,0)] to-[rgba(185,128,70,0.45)]", // бронза — 3 место
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="bg-[#0b0c14] min-h-screen text-white">
//         <div className="text-center pt-10 pb-4 text-2xl font-semibold">
//           Рейтинг спикеров
//         </div>

//         {/* Топ 3 */}
//         <div className="flex justify-center gap-6 items-end px-4 pb-20">
//           <div className="flex justify-center gap-6 items-end px-4 pb-20">
//             {[1, 0, 2].map((posIdx, visualIdx) => {
//               const speaker = top3[posIdx];
//               const gradient = gradients[posIdx];
//               const isFirst = posIdx === 0;
//               const isSecond = posIdx === 1;
//               const isThird = posIdx === 2;

//               const medalColor = isFirst
//                 ? "text-yellow-400"
//                 : isSecond
//                 ? "text-gray-400"
//                 : "text-orange-400";

//               const borderColor = isFirst
//                 ? "border-yellow-500"
//                 : isSecond
//                 ? "border-gray-400"
//                 : "border-orange-400";

//               return (
//                 <div
//                   key={speaker.id}
//                   className={`relative text-center rounded-2xl mx-6 p-6 w-64 transition-all duration-300
//           ${
//             isFirst
//               ? `scale-110 z-10 shadow-yellow-400/40 shadow-2xl bg-gradient-to-b ${gradient}`
//               : `bg-gradient-to-b ${gradient} shadow-md`
//           }`}
//                 >
//                   <div
//                     className={`text-8xl font-extrabold absolute -top-10 left-1/2 -translate-x-1/2 ${medalColor}`}
//                   >
//                     #{posIdx + 1}
//                   </div>
//                   <div
//                     className={`w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 ${borderColor}`}
//                   >
//                     <Image
//                       src={speaker.image || defaultLogo}
//                       alt={speaker.name}
//                       width={128}
//                       height={128}
//                       className="h-30 w-30 rounded-full object-cover"
//                     />
//                   </div>
//                   <h2 className="text-lg font-semibold">{speaker.name}</h2>
//                   <p className="text-sm text-gray-300 mb-2">
//                     Средний балл: {speaker.avg_speech.toFixed(1)}
//                   </p>
//                   <div className="text-sm text-gray-400">
//                     <div>ELO: {speaker.elo}</div>
//                     <div>Турниров: {speaker.num_tournaments}</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="max-w-5xl mx-auto px-2 pb-10">
//           {others.map((speaker: Speaker, index: number) => (
//             <div
//               key={speaker.id}
//               className="bg-[#13151f] mb-4 p-4 rounded-xl flex items-center justify-between"
//             >
//               <div className="flex items-center gap-4">
//                 <span className="text-xl font-bold text-gray-400">
//                   #{index + 4}
//                 </span>
//                 <div className="w-14 h-14 rounded-full overflow-hidden">
//                   <Image
//                     src={speaker.image || defaultLogo}
//                     alt={speaker.name}
//                     width={56}
//                     height={56}
//                   />
//                 </div>
//                 <div>
//                   <div className="font-semibold">{speaker.name}</div>
//                   <div className="text-sm text-gray-400">
//                     ELO: {speaker.elo}, Средний балл:{" "}
//                     {speaker.avg_speech.toFixed(1)}, Турниров:{" "}
//                     {speaker.num_tournaments}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

import Navbar from "@/components/shared/Navbar";
import { getTopSpeakers } from "../../lib/topspeakers";
import Image from "next/image";
import defaultLogo from "../../public/assets/default/default-avatar.png";
import { Search, Filter, ArrowUpRight } from "lucide-react";

export default async function RatingPage() {
  const speakers = await getTopSpeakers();
  const top3 = speakers.slice(0, 3);
  const others = speakers.slice(3);

  type Speaker = {
    id: string;
    name: string;
    image: string;
    avg_speech: number;
    elo: number;
    num_tournaments: number;
    organization?: string;
    achievements?: string[];
  };

  const gradients = [
    "from-[rgba(223,159,32,0)] to-[rgba(223,159,32,0.45)]",
    "from-[rgba(191,191,191,0)] to-[rgba(191,191,191,0.45)]",
    "from-[rgba(185,128,70,0)] to-[rgba(185,128,70,0.45)]",
  ];

  const podiumOrder = [1, 0, 2];

  const getRankData = (position: number) => {
    switch (position) {
      case 0:
        return {
          numberColor: "text-[#df9f20]",
          borderColor: "border-[#df9f20]",
          scale: "scale-110",
        };
      case 1:
        return {
          numberColor: "text-[#bfbfbf]",
          borderColor: "border-[#bfbfbf]",
          scale: "scale-100",
        };
      case 2:
        return {
          numberColor: "text-[#b98046]",
          borderColor: "border-[#b98046]",
          scale: "scale-100",
        };
      default:
        return {};
    }
  };

  const getRankStyling = (position: number) => {
    switch (position) {
      case 0:
        return {
          bgGradient: "from-[rgba(223,159,32,0)] to-[rgba(223,159,32,0.45)]",
          numberColor: "text-[#df9f20]",
          borderColor: "border-[#df9f20]",
        };
      case 1:
        return {
          bgGradient: "from-[rgba(191,191,191,0)] to-[rgba(191,191,191,0.45)]",
          numberColor: "text-[#bfbfbf]",
          borderColor: "border-[#bfbfbf]",
        };
      case 2:
        return {
          bgGradient: "from-[rgba(185,128,70,0)] to-[rgba(185,128,70,0.45)]",
          numberColor: "text-[#b98046]",
          borderColor: "border-[#b98046]",
        };
      default:
        return {
          bgGradient: "",
          numberColor: "text-white",
          borderColor: "border-gray-600",
        };
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen text-white pt-16">
        {/* Desktop: Top 3 Podium */}
        <div className="hidden lg:flex justify-center items-end gap-0 px-4 pb-20">
          {podiumOrder.map((position) => {
            const speaker = top3[position];
            if (!speaker) return null;

            const rankData = getRankData(position);
            const gradient = gradients[position];
            const isFirst = position === 0;

            return (
              <div
                key={speaker.id}
                className={`relative ${rankData.scale} transition-all duration-300 mx-6`}
              >
                {/* Large background number */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`text-[200px] font-black ${rankData.numberColor} opacity-30 leading-none select-none -mt-8`}
                  >
                    #{position + 1}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`
                  relative bg-gradient-to-b ${gradient} 
                  rounded-2xl p-8 w-80 text-center z-10
                  ${isFirst ? "transform -translate-y-6" : ""}
                `}
                >
                  {/* Avatar */}
                  <div
                    className={`
                    relative mb-6 rounded-full overflow-hidden mx-auto
                    border-4 ${rankData.borderColor}
                    ${isFirst ? "w-32 h-32" : "w-28 h-28"}
                  `}
                  >
                    <Image
                      src={speaker.image || defaultLogo}
                      alt={speaker.name}
                      width={isFirst ? 128 : 112}
                      height={isFirst ? 128 : 112}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Name */}
                  <h2
                    className={`font-bold mb-2 ${
                      isFirst ? "text-2xl" : "text-xl"
                    }`}
                  >
                    {speaker.name}
                  </h2>

                  {/* Average Score */}
                  <div className="mb-4">
                    <div className="text-gray-300 text-sm">
                      Средний балл - {speaker.avg_speech.toFixed(1)}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="text-sm text-gray-200 space-y-1 leading-relaxed">
                    <div>
                      <strong>NCYD</strong> - Полу-финалист, Лучший спикер
                    </div>
                    <div>
                      <strong>ACS Cup</strong> - Лучший спикер
                    </div>
                    <div>
                      <strong>Quantum Cup</strong> - Победитель
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Integrated Top 3 + All Speakers List */}
        <div className="lg:hidden">
          <div className="max-w-6xl mx-auto px-4 pb-12">
            {/* Section Header */}
            <div className="flex flex-col items-start justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold">Рейтинг спикеров</h2>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск по имени"
                    className="bg-background border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64"
                  />
                </div>

                <select className="bg-background border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option>Сортировать по ELO</option>
                  <option>Сортировать по среднему баллу</option>
                  <option>Сортировать по турнирам</option>
                </select>

                <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4" />
                  Все фильтры
                </button>
              </div>
            </div>

            {/* All Speakers List (including top 3) */}
            <div className="space-y-3">
              {speakers.map((speaker: Speaker, index: number) => {
                const isTopThree = index < 3;
                const styling = getRankStyling(index);

                return (
                  <div
                    key={speaker.id}
                    className={`
                      ${
                        isTopThree
                          ? `bg-gradient-to-r ${styling.bgGradient} border-2 ${styling.borderColor}`
                          : "bg-primary border border-gray-700"
                      }
                      hover:bg-[#1a1d29] rounded-xl p-4 transition-all duration-200 group cursor-pointer relative
                    `}
                  >
                    {/* Rank number */}
                    <div className="absolute top-3 left-4 z-10">
                      <div
                        className={`
                        text-3xl font-black opacity-80 leading-none
                        ${isTopThree ? styling.numberColor : "text-white"}
                      `}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 ml-12">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar */}
                        <div
                          className={`
                          rounded-full overflow-hidden
                          ${
                            isTopThree
                              ? `border-2 ${styling.borderColor} w-16 h-16`
                              : "w-12 h-12"
                          }
                        `}
                        >
                          <Image
                            src={speaker.image || defaultLogo}
                            alt={speaker.name}
                            width={isTopThree ? 64 : 48}
                            height={isTopThree ? 64 : 48}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`
                            font-semibold mb-1 truncate
                            ${isTopThree ? "text-lg" : "text-base"}
                          `}
                          >
                            {speaker.name}
                          </div>
                          <div className="text-xs text-gray-400 flex flex-col gap-1">
                            <div className="bg-gray-700 rounded px-2 py-1 text-xs inline-block w-fit">
                              Парасат
                            </div>
                            <span>Астана, ЕНУ</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-center">
                        <div>
                          <div
                            className={`
                            font-bold
                            ${isTopThree ? "text-lg" : "text-base"}
                          `}
                          >
                            {speaker.elo.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-400">ELO</div>
                        </div>
                        <div>
                          <div
                            className={`
                            font-bold
                            ${isTopThree ? "text-lg" : "text-base"}
                          `}
                          >
                            {speaker.avg_speech.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Средний балл
                          </div>
                        </div>
                        <div>
                          <div
                            className={`
                            font-bold
                            ${isTopThree ? "text-lg" : "text-base"}
                          `}
                          >
                            {speaker.num_tournaments}
                          </div>
                          <div className="text-xs text-gray-400">Турниры</div>
                        </div>
                      </div>

                      {/* Top 3 achievements */}
                      {isTopThree && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-200 space-y-1 leading-relaxed">
                            <div>
                              <strong>NCYD</strong> - Полу-финалист, Лучший
                              спикер
                            </div>
                            <div>
                              <strong>ACS Cup</strong> - Лучший спикер
                            </div>
                            <div>
                              <strong>Quantum Cup</strong> - Победитель
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop: All Speakers Section (excluding top 3) */}
        <div className="hidden lg:block max-w-6xl mx-auto px-6 pb-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Все спикеры</h2>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск по имени"
                  className="bg-background border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64"
                />
              </div>

              <select className="bg-background border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option>Сортировать по ELO</option>
                <option>Сортировать по среднему баллу</option>
                <option>Сортировать по турнирам</option>
              </select>

              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Все фильтры
              </button>
            </div>
          </div>

          {/* Speakers List (excluding top 3) */}
          <div className="space-y-3">
            {others.map((speaker: Speaker, index: number) => (
              <div
                key={speaker.id}
                className="bg-primary hover:bg-[#1a1d29] rounded-xl p-6 transition-all duration-200 group cursor-pointer relative"
              >
                {/* Rank number positioned at top */}
                <div className="absolute top-4 left-6">
                  <div className="text-6xl font-black text-white opacity-80 leading-none">
                    {index + 4}
                  </div>
                </div>

                <div className="flex items-center justify-between ml-20">
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={speaker.image || defaultLogo}
                        alt={speaker.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-semibold text-xl mb-1">
                        {speaker.name}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <div className="bg-gray-700 rounded px-2 py-1 text-xs">
                          Парасат
                        </div>
                        <span>Астана, ЕНУ</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-12 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {speaker.elo.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">ELO</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {speaker.avg_speech.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Средний балл</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {speaker.num_tournaments}
                      </div>
                      <div className="text-sm text-gray-400">
                        Кол-во турниров
                      </div>
                    </div>
                  </div>

                  <div className="text-gray-400 group-hover:text-white transition-colors ml-6">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
