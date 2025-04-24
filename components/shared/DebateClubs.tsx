import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import zhetiImage from '@/public/assets/debateClubs/zheti.png';
import parasatImage from '@/public/assets/debateClubs/parasat.png';
import mangilikImage from '@/public/assets/debateClubs/mangilik.png';
import Qlogo from '@/public/assets/Qclub.svg';

type DebateClub = {
  name: string;
  location: string;
  rating: number;
  image: string;
};

const debateClubs: DebateClub[] = [
  {
    name: 'Parasat',
    location: 'Астана',
    rating: 4.9,
    image: parasatImage.src,
  },
  {
    name: 'Жеті Жарғы',
    location: 'Астана, ЕНУ',
    rating: 4.7,
    image: zhetiImage.src,
  },
  {
    name: 'Mangilik',
    location: 'Астана',
    rating: 4.8,
    image: mangilikImage.src,
  },
  {
    name: 'Qdeb Club',
    location: 'Astana, ENU',
    rating: 4.6,
    image: mangilikImage.src,
  },
  {
    name: 'AUES Speakers',
    location: 'Almaty, AUES',
    rating: 4.5,
    image: parasatImage.src,
  },
  {
    name: 'KBTU Debaters',
    location: 'Almaty, KBTU',
    rating: 4.4,
    image: zhetiImage.src,
  },
];

const DebateClubs = () => {
  return (
    <section className="my-24 mx-19">
      <h2 className="text-3xl font-bold mb-6">Дебатные клубы</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {debateClubs.map((club, index) => (
          <Card
          key={index}
          className="bg-primary border-none flex flex-col p-10 gap-4 relative overflow-hidden"
          style={{
            backgroundImage: `url(${Qlogo.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right bottom',
            backgroundSize: '40%',
          }}
        >
            <div className="flex w-full gap-4 items-center"
              
            >
              <img
                src={club.image}
                alt={club.name}
                className="w-18 h-18 object-cover rounded-lg"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{club.name}</h3>
                <p className="text-sm text-muted-foreground">{club.location}</p>
                <p className="text-sm">Рейтинг: {club.rating} / 5</p>
              </div>
            </div>
            <Button className="border bg-primary hover:bg-secondary/20 mt-2 w-[150px] h-10 rounded-lg">
              Подробнее
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default DebateClubs;
