import React from "react";
import { Card, CardContent } from "../ui/card";

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
  console.log("Avatar src:", avatar);
  return (
    <Card className="relative mr-10 flex flex-col w-[410px] sm:flex-row items-start sm:items-center gap-10 p-10 overflow-hidden bg-primary border-none ">
      <div className="absolute -top-5 -left-5 w-30 h-30 sm:w-40 sm:h-40 rounded-full overflow-hidden z-10">
        <img
          src={avatar}
          alt={full_name}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="flex flex-col p-0 ml-15 sm:ml-32">
        <h3 className="font-semibold text-lg">{full_name}</h3>
        <p className="text-sm mt-1">Рейтинг: {elo_rating}</p>
        <p className="text-sm mt-1">Средний балл: {avg_speech}</p>
        <p className="text-sm mt-1">
          Общее количество достижений: {total_achievements}
        </p>
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
