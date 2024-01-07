import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Card from "./Card"
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useState } from "react"
import { thunkEditList } from "../../redux/board"

export default function List({ list, cards, index }) {
    const dispatch = useDispatch()
    const board = useSelector(state => state.board)
    const [showListEdit, setShowListEdit] = useState(false)
    const [listName, setListName] = useState(list.name)
    const [showListPopup, setShowListPopup] = useState(false)
    const [showNewCard, setShowNewCard] = useState(false)
    const [newCardName, setNewCardName] = useState('')

    const handleEditListSubmit = async (e) => {
        e.preventDefault()
        setShowListEdit(false)
        await dispatch(thunkEditList({
            ...list,
            name: listName,
            card_order: JSON.stringify(list.card_order)
        }, board.id))
    }

    useEffect(() => {
        if (document.getElementById('edit-list-input')) {
            document.getElementById('edit-list-input').focus()
        }
    }, [showListEdit])

    return (
        <Draggable draggableId={`list${list.id}`} index={(board.list_order).indexOf(list.id)} type="list">
            {(provided, snapshot) => (
                <div className={`list-wrapper${snapshot.isDragging ? ` list-dragging` : ``}`}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div className="list">
                        <div className="list-header"
                            {...provided.dragHandleProps}
                        >
                            {((showListEdit)) && (<form className="edit-list" id="edit-list" onSubmit={handleEditListSubmit}>
                                <input
                                    id='edit-list-input'
                                    type="text"
                                    value={listName}
                                    onChange={e => setListName(e.target.value)}
                                />
                            </form>)}
                            {(!(showListEdit)) && (<div className="list-name" onClick={() => setShowListEdit(true)}>
                                {list.name}
                            </div>)}
                            <i className="fa-solid fa-ellipsis"></i></div>
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
                    {(showListEdit) && (
                        <div className="cover-everything" onClick={handleEditListSubmit} />
                    )}
                </div>
            )}
        </Draggable>
    )
}