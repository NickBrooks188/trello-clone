import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Card from "./Card"
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useState } from "react"
import { thunkAddCard, thunkEditList, thunkRemoveList } from "../../redux/board"

export default function List({ list, cards, index }) {
    const dispatch = useDispatch()
    const board = useSelector(state => state.board)
    const [showListEdit, setShowListEdit] = useState(false)
    const [listName, setListName] = useState(list.name)
    const [showListPopup, setShowListPopup] = useState(false)
    const [showNewCard, setShowNewCard] = useState(false)
    const [newCardName, setNewCardName] = useState('')

    const validateListName = (val) => {
        if (val.length < 50) {
            setListName(val)
        }
    }

    const validateNewCardName = (val) => {
        if (val.length < 50) {
            setNewCardName(val)
        }
    }

    const handleEditListSubmit = async (e) => {
        e.preventDefault()
        setShowListEdit(false)
        if (listName === list.name) return
        await dispatch(thunkEditList({
            ...list,
            name: listName,
            card_order: JSON.stringify(list.card_order)
        }, board.id))
    }

    const handleListDelete = async (e) => {
        e.preventDefault()
        const serverData = await dispatch(thunkRemoveList(list.id))
        if (!(serverData.errors)) {
            setShowListPopup(false)
        }
    }

    const handleNewCardSubmit = async (e) => {
        e.preventDefault()
        setShowNewCard(false)
        if (newCardName) {
            await dispatch(thunkAddCard({
                name: newCardName
            }, list.id))
        }
        setNewCardName('')
    }

    useEffect(() => {
        if (document.getElementById('edit-list-input')) {
            document.getElementById('edit-list-input').focus()
        }
    }, [showListEdit])

    useEffect(() => {
        if (document.getElementById('new-card-input')) {
            document.getElementById('new-card-input').focus()
        }
    }, [showNewCard])

    return (
        <Draggable draggableId={`list${list.id}`} index={(board.list_order).indexOf(list.id)} type="list">
            {(provided, snapshot) => (
                <div className={`list-wrapper${snapshot.isDragging ? ` list-dragging` : ``}`}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div className="list" id={`list${list.id}`}>
                        <div className="list-header"
                            {...provided.dragHandleProps}
                        >
                            {((showListEdit)) && (<form className="edit-list" id="edit-list" onSubmit={handleEditListSubmit}>
                                <input
                                    id='edit-list-input'
                                    type="text"
                                    value={listName}
                                    onChange={e => validateListName(e.target.value)}
                                />
                            </form>)}
                            {(!(showListEdit)) && (<div className="list-name" onClick={() => setShowListEdit(true)}>
                                <span>{list.name}</span>
                            </div>)}
                            <div className="list-header-right" onClick={() => setShowListPopup(true)}>
                                {!(showListPopup) && (
                                    <i className="fa-solid fa-ellipsis"></i>
                                )}
                                {(showListPopup) && (
                                    <div className="list-popup">
                                        <div className='close-modal-x' onClick={() => setShowListPopup(false)}><i className="fa-solid fa-xmark"></i></div>

                                        <h2>List actions</h2>
                                        <button className="delete-list-button" onClick={handleListDelete}>Delete list</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Droppable droppableId={`card-list-${list.id}`} index={index} type="card">
                            {(provided) => (
                                <div className="cards-wrapper"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {cards.map((cardId, index) => <Card key={cardId} card={board.lists[list.id].cards[cardId]} index={index} />)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className="new-card-wrapper">
                            {(showNewCard) && (<form className="new-card" onSubmit={handleNewCardSubmit}>
                                <input
                                    id='new-card-input'
                                    type='text'
                                    placeholder='Enter a title for this card...'
                                    value={newCardName}
                                    onChange={e => validateNewCardName(e.target.value)}
                                />
                            </form>)}
                            {(!showNewCard) && (
                                <button className="add-card-button" onClick={() => setShowNewCard(true)}><i className="fa-solid fa-plus"></i> Add a card</button>
                            )}
                        </div>
                    </div>
                    {(showListEdit) && (
                        <div className="cover-everything" onClick={handleEditListSubmit} />
                    )}
                    {(showListPopup) && (
                        <div className="cover-everything" onClick={() => setShowListPopup(false)} />
                    )}
                    {(showNewCard) && (
                        <div className="cover-everything" onClick={handleNewCardSubmit} />
                    )}
                </div>
            )
            }
        </Draggable >
    )
}