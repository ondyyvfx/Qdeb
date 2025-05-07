import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import zhetiImage from "@/public/assets/debateClubs/zheti.png";
import parasatImage from "@/public/assets/debateClubs/parasat.png";
import mangilikImage from "@/public/assets/debateClubs/mangilik.png";
import oratorImage from "@/public/assets/debateClubs/orator.png";
import ordaImage from "@/public/assets/debateClubs/orda.png";
import nomadImage from "@/public/assets/debateClubs/nomad.png";
import Qlogo from "@/public/assets/Qclub.svg";

type DebateClub = {
  name: string;
  location: string;
  // amount: number;
  image: string;
};

const debateClubs: DebateClub[] = [
  {
    name: "Parassat",
    location: "Астана, ENU",
    // amount: 0,
    image: parasatImage.src,
  },
  {
    name: "Жеті Жарғы",
    location: "Астана, ENU",
    // amount: 0,
    image: zhetiImage.src,
  },
  {
    name: "Mangilik",
    location: "Астана, Аграрный университет",
    // amount: 0,
    image: mangilikImage.src,
  },
  {
    name: "Orator",
    location: "Астана, ENU",
    // amount: 0,
    image: oratorImage.src,
  },
  {
    name: "Orda",
    location: "Астана, MNU",
    // amount: 0,
    image: ordaImage.src,
  },
  {
    name: "Nomad",
    location: "Astana, NU",
    // amount: 0,
    image: nomadImage.src,
  },
];

const DebateClubs = () => {
  return (
    <section className="my-24 mx-3 md:mx-10 lg:mx-19">
      <h2 className="text-3xl font-bold mb-6">Дебатные клубы</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {debateClubs.map((club, index) => (
          <Card
            key={index}
            className="bg-primary border-none flex flex-col p-10 gap-4 relative overflow-hidden"
            style={{
              backgroundImage: `url(${Qlogo.src})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right bottom",
              backgroundSize: "40%",
            }}
          >
            <div className="flex w-full gap-4 items-center">
              <img
                src={club.image}
                alt={club.name}
                className="w-18 h-18 object-cover rounded-lg"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{club.name}</h3>
                <p className="text-sm text-muted-foreground">{club.location}</p>
                {/* <p className="text-sm">Количество участников: {club.amount}</p> */}
              </div>
            </div>
            <Button className="border bg-primary hover:bg-secondary/20 mt-2 w-[150px] h-12 rounded-lg border-white/50">
              Подробнее
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default DebateClubs;
