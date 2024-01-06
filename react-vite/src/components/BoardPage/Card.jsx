import { Draggable } from 'react-beautiful-dnd'

export default function Card({ card, index }) {
    if (!card) return
    return (
        <Draggable draggableId={`${card.id}`} index={index} type="card">
            {(provided, snapshot) => (
                <div className={`card${snapshot.isDragging ? ` card-dragging` : ``}`}
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