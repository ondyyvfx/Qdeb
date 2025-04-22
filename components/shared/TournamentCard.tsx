import React from 'react';

export type card = {
  title: string;
  date: string;
  cost: number;
  location: string;
  backgroundUrl: string;
};


 const TournamentCard = (props:card) => {
  return (
    <div
    className="rounded-lg text-white p-0 flex flex-col justify-between shadow-lg"
      style={{
        backgroundImage: `url(${props.backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left top',
        minHeight: '300px', // Удлиняем карточку
      }}>
        <div className="bg-background text-text border border-white/10 rounded-lg p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{props.title}</h2>
            <p className="text-sm">Дата: {props.date}</p>
            <p className="text-sm">Стоимость: {props.cost ? `${props.cost} ₽` : 'Бесплатно'}</p>
            <p className="text-sm">Локация: {props.location}</p>
        </div>
    </div>
  )
}

export default TournamentCard;
