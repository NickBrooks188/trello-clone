import { Draggable } from 'react-beautiful-dnd'

export default function Card({ card, index }) {
    if (!card) return
    return (
        <Draggable draggableId={String(card.id)} index={index}>
            {provided => (
                <div className="card"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {card.name}
                </div>

            )}
        </Draggable>
    )
}