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
};

const SpeakerCard = ({
  full_name,
  avatar,
  elo_rating,
  achievements,
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
