import { useSelector } from "react-redux"
import Card from "./Card"
import { Droppable } from 'react-beautiful-dnd'
export default function List({ list, cards, index }) {

    const board = useSelector(state => state.board)

    return (
        <div className="list">
            <h3>{list.name}</h3>
            <Droppable droppableId={String(list.id)} index={index}>
                {provided => (
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
    )
}