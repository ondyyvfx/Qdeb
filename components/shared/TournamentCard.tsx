import React from 'react';
import { Button } from '../ui/button';

export type card = {
  title: string;
  date: string;
  cost: number;
  location: string;
  backgroundUrl: string;
};




const TournamentCard = (props: card) => {
  const formatDate = (date: string) => {
    // Преобразуем дату из формата "30.04.2025" в "2025-04-30"
    const [day, month, year] = date.split('.'); // Разделяем строку по точке
    const formattedDate = `${year}-${month}-${day}`; // Формируем строку в формате YYYY-MM-DD
  
    const eventDate = new Date(formattedDate);
  
    if (eventDate instanceof Date && !isNaN(eventDate.getTime())) {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return eventDate.toLocaleDateString('ru-RU', options); // Правильный формат для TypeScript
    } else {
      console.error("Invalid date format:", date);
      return date; // если дата некорректная, возвращаем её как есть
    }
  };  
  

  return (
<div
  className="bg-primary rounded-lg text-white p-0 flex flex-col justify-between w-full"
  style={{
    backgroundImage: `url(${props.backgroundUrl})`,
    backgroundPosition: 'absolute',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '30%',
  }}
>
  <div className="m-4 text-text rounded-lg p-4 flex flex-col gap-1">
    <div className="flex items-baseline">
      <h2 className="text-xl font-bold mb-0">{props.title}</h2>
      <p className="text-xs mb-0 ml-4">{formatDate(props.date)}</p>
    </div>
    <p className="text-xs mb-0.5">{props.cost ? `${props.cost} ₽` : 'Бесплатно'}</p>
    <p className="text-xs mb-0">{props.location}</p>
    <Button className="mt-4 text-black bg-white hover:bg-white w-40 h-9 font-bold" size="sm">
      Регистрация
    </Button>
  </div>
</div>

  );
};

export default TournamentCard;
