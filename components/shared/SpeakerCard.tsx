import React from "react";
import { Card, CardContent } from "../ui/card";

type SpeakerCardProps = {
  full_name: string;
  avatar: string;
  elo_rating: number;
  achievements?: string;
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
        src={avatar || "/avatars/default.jpg"}
        alt={full_name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <CardContent className="flex flex-col p-0">
        <h3 className="font-semibold text-lg">{full_name}</h3>
        <p className="text-sm mt-1">Рейтинг: {elo_rating}</p>
        {achievements && (
          <p className="text-sm text-muted-foreground mt-1">{achievements}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeakerCard;
