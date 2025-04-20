import React from 'react'
import TournamentCard, { card } from './TournamentCard'



const cards:card[] = [
    {
        title: 'American Corned Cup',
        date: '2023-10-01',
        cost: 100,
        location: 'New York, USA'
    },
    {
        title: 'American Corned Cup',
        date: '2023-10-01',
        cost: 100,
        location: 'New York, USA'
    },
    {
        title: 'American Corned Cup',
        date: '2023-10-01',
        cost: 100,
        location: 'New York, USA'
    },
]

const UpcomingTournaments = () => {
  return (
    <div className='mx-19'>
        <h1 className="text-3xl font-bold mb-8">Ближайшие турниры</h1>
        <div className='flex flex-row overflow-hidden justify-between gap-4'>
        {cards.map((card, index) => (
            <TournamentCard key={index} title={card.title} date={card.date} cost={card.cost} location={card.location} />
        ))}
        </div>
    </div>
  )
}

export default UpcomingTournaments