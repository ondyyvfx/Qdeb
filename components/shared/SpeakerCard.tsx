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
    <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-10 p-10 bg-primary border-none">
      <img
        src={avatar}
        alt={full_name}
        className="w-24 h-24 sm:w-16 sm:h-16 rounded-full object-cover"
      />
      <CardContent className="flex flex-col p-0">
        <h3 className="font-semibold text-lg">{full_name}</h3>
        <p className="text-sm mt-1">Рейтинг: {elo_rating}</p>
        <p className="text-sm mt-1">Средний балл: {avg_speech}</p>
        <p className="text-sm mt-1">
          Общее количество достижений: {total_achievements}
        </p>
        {achievements && achievements.length > 0 && (
          <div className="text-sm text-muted-foreground mt-1">
            {achievements.map((achievement) => (
              <p key={achievement.tournament_id}>{achievement.title}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeakerCard;
