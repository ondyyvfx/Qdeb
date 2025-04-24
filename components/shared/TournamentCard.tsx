import React from 'react';
import { Button } from '../ui/button';

export type TournamentCardProps = {
  title: string;
  date: string;
  cost: number;
  location: string;
  backgroundUrl: string;
};

const TournamentCard = (props: TournamentCardProps) => {
  const formatDate = (date: string) => {
    const [day, month, year] = date.split('.'); 
    const formattedDate = `${year}-${month}-${day}`; 
    const eventDate = new Date(formattedDate);
  
    if (eventDate instanceof Date && !isNaN(eventDate.getTime())) {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return eventDate.toLocaleDateString('ru-RU', options); 
    } else {
      console.error("Invalid date format:", date);
      return date; 
    }
  };

  return (
    <div
      className="bg-primary rounded-lg text-white p-0 flex flex-col justify-between w-full h-[200px] md:h-[220px] lg:h-[230px]" // Увеличиваем высоту карточки
      style={{
        backgroundImage: `url(${props.backgroundUrl})`,
        backgroundPosition: 'left top', // Фото теперь в левом верхнем углу
        backgroundRepeat: 'no-repeat',
        backgroundSize: '165px', // Размер фото фиксирован для корректного отображения
      }}
    >
      <div className="m-4 text-text rounded-lg p-4 flex flex-col gap-2 mt-6">
        <div className="flex items-baseline">
          <h2 className="ml-2 text-2xl font-bold mb-0">{props.title}</h2>
          <p className="text-sm mb-0 ml-4">{formatDate(props.date)}</p>
        </div>
        <p className="ml-2 text-sm mb-0.5">{props.cost ? `${props.cost} KZT` : 'Бесплатно'}</p>
        <p className="ml-2 text-sm mb-0">{props.location} </p>
        <Button className="ml-2 mt-5 text-black bg-white hover:bg-white w-40 h-9 font-bold" size="sm">
          Регистрация
        </Button>
      </div>
    </div>
  );
};

export default TournamentCard;
