import React from 'react'


export type card = {
    title: string
    date: string
    cost: number | null
    location: string
}

const TournamentCard = (props:card) => {
  return (
    <div>
        <div className="bg-background text-text border border-white/10 rounded-lg p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{props.title}</h2>
            <p className="text-sm">Дата: {props.date}</p>
            <p className="text-sm">Стоимость: {props.cost ? `${props.cost} ₽` : 'Бесплатно'}</p>
            <p className="text-sm">Локация: {props.location}</p>
        </div>
    </div>
  )
}

export default TournamentCard
