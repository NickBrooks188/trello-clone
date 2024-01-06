import { useSelector } from "react-redux"
import Card from "./Card"
import { Droppable, Draggable } from 'react-beautiful-dnd'
export default function List({ list, cards, index }) {

    const board = useSelector(state => state.board)

    return (
        <Draggable draggableId={`list${list.id}`} index={(board.list_order).indexOf(list.id)} type="list">
            {(provided, snapshot) => (
                <div className={`list-wrapper${snapshot.isDragging ? ` list-dragging` : ``}`}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div className="list">
                        <div className="list-name"
                            {...provided.dragHandleProps}
                        >{list.name} <i className="fa-solid fa-ellipsis"></i></div>
                        <Droppable droppableId={`card-list-${list.id}`} index={index} type="card">
                            {(provided, snapshot) => (
                                <div className="cards-wrapper"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {cards.map((cardId, index) => <Card key={cardId} card={board.lists[list.id].cards[cardId]} index={index} />)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    )
}