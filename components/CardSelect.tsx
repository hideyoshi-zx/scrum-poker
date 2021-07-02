import React from 'react'
import { CARDS, Card } from '../types'

type Props = {
  selected: Card | ''
  onChange: (card: Card) => any
}

export default function CardSelect ({ selected, onChange }: Props) {
  return (
    <>
      <p className="text-center text-gray-500">Choose your card</p>
      <div className="mt-4 w-min mx-auto flex justify-center py-4 px-6 space-x-4 bg-white rounded">
        { CARDS.map(card => <CardButton key={card} card={card} selected={selected} onClick={onChange} />) }
      </div>
    </>
  )
}

function CardButton ({ card, selected, onClick }: { card: Card, selected: Card | '', onClick: (card: Card) => any }) {
  const isSelected = card === selected
  const normalClassName = 'h-16 w-12 text-xl font-bold rounded border-2 border-blue-100 text-blue-400 bg-blue-50 hover:bg-blue-100 transition-all'
  const activeClassName = 'h-16 w-12 text-xl font-bold rounded shadow-md bg-blue-500 text-white transform -translate-y-3 transition-all cursor-default'
  const className = isSelected ? activeClassName : normalClassName

  return (
    <button
      type="button"
      onClick={() => { onClick(card) }}
      disabled={isSelected}
      className={className}>
      {card}
    </button>
  )
}
