import { Draggable } from 'react-beautiful-dnd'
import CardModal from '../CardModal/CardModal'
import OpenModalButton from '../OpenModalButton'
import { OpenModalDiv } from '../OpenModalButton/OpenModalButton'

export default function Card({ card, index }) {

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
                        <OpenModalDiv
                            modalComponent={<CardModal card={card} />}
                            buttonText={(
                                <div className='card-content-wrapper'>
                                    <div className='card-labels-wrapper'>
                                        {card.label.map((label) => (
                                            <div className='card-label'
                                                key={`C-${label}`}
                                                style={{
                                                    "backgroundColor": label
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className='card-name'>

                                        {card.name}
                                    </div>
                                </div>

                            )}
                        />
                    </div>
                </div>

            )}
        </Draggable>
    )
}