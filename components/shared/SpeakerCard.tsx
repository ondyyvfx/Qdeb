"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type Achievement = {
  title: string;
  tournament_id: number;
};

type SpeakerCardProps = {
  full_name: string;
  avatar: string;
  elo_rating: number;
  achievements?: Achievement[];
  avg_speech: number;
  total_achievements: number;
};

const SpeakerCard = ({
  full_name,
  avatar,
  elo_rating,
  achievements,
  avg_speech,
  total_achievements,
}: SpeakerCardProps) => {
  const { t } = useLanguage();
  return (
    <Card
      className="relative mr-4 flex flex-col sm:flex-row items-start sm:items-center gap-6 
             p-6 sm:p-8 md:p-10 overflow-hidden bg-primary border-none 
             w-[320px] sm:w-[500px] lg:w-[504px] 3xl:w-[640px]
             h-auto sm:h-[190px] lg:h-[220px] 3xl:h-[296px]"
    >
      <div className="absolute -top-4 -left-4 lg:-top-7 lg:-left-7 w-[120px] sm:w-[120px] md:w-[185px] h-[120px] sm:h-[120px] md:h-[185px] rounded-full overflow-hidden z-10">
        <img
          src={avatar}
          alt={full_name}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="flex flex-col p-0 ml-24 sm:ml-38 h-[100px] sm:h-[100px] md:h-[210px]">
        <h3 className="font-bold text-[16px] sm:text-[24px] mt-5">
          {full_name}
        </h3>
        <p className="text-sm text-[15px] sm:text-[20px] text-gray-300">
          {t.shared.avgScore} {avg_speech}
        </p>
        <ul className="text-[15px] sm:text-[20px] mt-2 sm:mt-5 list-disc">
          {achievements?.map((achievement, index) => {
            return (
              <li key={index} className="truncate max-w-full">
                {achievement.title}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SpeakerCard;

{
  /* {achievements && achievements.length > 0 && (
          <div className="text-sm text-muted-foreground mt-1">
            {achievements.map((achievement) => (
              <p key={achievement.tournament_id}>{achievement.title}</p>
            ))}
          </div>
        )} */
}
