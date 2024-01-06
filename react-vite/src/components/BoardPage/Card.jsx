import { Draggable } from 'react-beautiful-dnd'

export default function Card({ card, index }) {

    const test = () => {
        alert('alert!')
    }

    if (!card) return
    return (
        <Draggable draggableId={`${card.id}`} index={index} type="card">
            {(provided, snapshot) => (
                <div className={`card-wrapper${snapshot.isDragging ? ` card-dragging` : ``}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div className='card' >
                        {card.name}
                    </div>
                </div>

            )}
        </Draggable>
    )
}