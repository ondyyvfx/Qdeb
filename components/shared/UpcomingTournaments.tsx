'use client';

import React, { useEffect, useState } from 'react';
import TournamentCard, { card } from './TournamentCard';

// --------- Кол-во ближайших турниров, которые мы хотим отобразить
const NUMBER_OF_EVENTS = 3;

const UpcomingTournaments = () => {
  const [cards, setCards] = useState<card[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/events/nearest/${NUMBER_OF_EVENTS}/`);
        const data = await res.json();

        const formatted = data.map((event: any) => {
          const rawDate = event.event_datetime.split('T')[0]; // "2025-04-30"
          const [year, month, day] = rawDate.split('-');
          return {
            title: event.title,
            date: `${day}.${month}.${year}`, // "30.04.2025"
            cost: event.cost,
            location: event.city,
            backgroundUrl: '/assets/Q.svg', // <--- Путь к твоей картинке
          };
        });

        setCards(formatted);
      } catch (error) {
        console.error('Ошибка при загрузке турниров:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className='my-14 mx-19'>
      <h1 className="text-3xl font-bold mb-6">Ближайшие турниры</h1>
      <div className="flex flex-row overflow-hidden justify-between gap-4">
        {cards.map((card, index) => (
          <TournamentCard
            key={index}
            title={card.title}
            date={card.date}
            cost={card.cost}
            location={card.location}
            backgroundUrl={card.backgroundUrl} // <--- Передаем сюда фон
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingTournaments;
