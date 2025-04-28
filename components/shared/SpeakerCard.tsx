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
  avg_speech: number; // Добавляем новый пропс avg_speech
  total_achievements: number; // Добавляем новый пропс total_achievements
};

const SpeakerCard = ({
  full_name,
  avatar,
  elo_rating,
  achievements,
  avg_speech,
  total_achievements,
}: SpeakerCardProps) => {
  return (
    <Card className="flex items-center gap-4 p-4 bg-primary border-none">
      <img
        src={avatar || "/assets/default-avatar.png"}
        alt={full_name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <CardContent className="flex flex-col p-0">
        <h3 className="font-semibold text-lg">{full_name}</h3>
        <p className="text-sm mt-1">Рейтинг: {elo_rating}</p>
        {/* Отображаем avg_speech и total_achievements */}
        <p className="text-sm mt-1">Средняя речь: {avg_speech}</p>
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
