import React from 'react';
import { Card, CardContent } from '../ui/card';

type Speaker = {
  name: string;
  country: string;
  avatar: string;
  score: number;
};

const topSpeakers: Speaker[] = [
  {
    name: 'Aigerim S.',
    country: 'Kazakhstan',
    avatar: '/avatars/aigerim.jpg',
    score: 95,
  },
  {
    name: 'John M.',
    country: 'USA',
    avatar: '/avatars/john.jpg',
    score: 92,
  },
  {
    name: 'Amina B.',
    country: 'Uzbekistan',
    avatar: '/avatars/amina.jpg',
    score: 90,
  },
];

const TopSpeakersSection = () => {
  return (
    <section className="my-24 mx-19">
      <h1 className="text-3xl font-bold mb-6">Лучшие спикеры</h1>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topSpeakers.map((speaker, index) => (
          <Card key={index} className="flex items-center gap-4 p-4 bg-primary border-none">
            <img
              src={speaker.avatar}
              alt={speaker.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <CardContent className="flex flex-col">
              <h3 className="font-semibold text-lg">{speaker.name}</h3>
              <p className="text-sm text-muted-foreground">{speaker.country}</p>
              <p className="text-sm mt-1">Рейтинг: {speaker.score} / 100</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TopSpeakersSection;
