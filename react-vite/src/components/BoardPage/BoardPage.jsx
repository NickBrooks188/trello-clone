import { useDispatch, useSelector } from 'react-redux'
import './BoardPage.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SideNavbar from '../SideNavbar'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import OpenModalButton from '../OpenModalButton';
import List from './List'
import { thunkLoadBoard, thunkEditBoard, thunkEditList, thunkEditCard, moveCard, thunkAddList } from '../../redux/board'
import BoardModal from '../BoardModal'


export default function BoardPage() {
    const dispatch = useDispatch()
    const { boardId } = useParams()
    const board = useSelector(state => state.board)
    const themes = useSelector(state => state.themes)
    const [showNewList, setShowNewList] = useState(false)
    const [newListName, setNewListName] = useState('')
    const [theme, setTheme] = useState(themes[board.theme_id] || '')

    useEffect(() => {
        dispatch(thunkLoadBoard(boardId))
    }, [dispatch, boardId])

    useEffect(() => {
        setTheme(themes[board.theme_id])
    }, [board, themes])


    const onDragEnd = async (result) => {

        const { destination, source, type } = result

        if (!(result.destination)) {
            return
        }

        if (type === "list") {
            if (destination.index === source.index) return
            const boardTemp = { ...board }
            let lists = boardTemp.list_order
            const listId = lists[source.index]
            lists.splice(source.index, 1)
            lists.splice(destination.index, 0, listId)

            boardTemp.list_order = JSON.stringify(lists)
            const putData = await dispatch(thunkEditBoard(boardTemp))
            if (!putData.errors) return

        } else if (type === "card") {

            if (destination.droppableId === source.droppableId) {
                if (destination.index === source.index) return
                const list = { ...board.lists[Number(destination.droppableId.slice(10))] }
                let cards = list.card_order
                const cardId = cards[source.index]
                cards.splice(source.index, 1)
                cards.splice(destination.index, 0, cardId)

                list.card_order = JSON.stringify(cards)

                const putData = await dispatch(thunkEditList(list))
                if (!putData.errors) {
                    return
                }
            } else {
                const sourceList = { ...board.lists[Number(source.droppableId.slice(10))] }
                const destinationList = { ...board.lists[Number(destination.droppableId.slice(10))] }
                let sourceCards = sourceList.card_order
                let destinationCards = destinationList.card_order
                const cardId = sourceCards[source.index]
                const card = sourceList.cards[cardId]
                sourceCards.splice(source.index, 1)
                destinationCards.splice(destination.index, 0, cardId)

                sourceList.card_order = JSON.stringify(sourceCards)
                destinationList.card_order = JSON.stringify(destinationCards)
                card.list_id = destinationList.id

                await dispatch(moveCard(card.id, destinationList.id, sourceList.id))
                await dispatch(thunkEditCard(card, card.list_id))
                const putDataSource = await dispatch(thunkEditList(sourceList))
                if (!putDataSource.errors) {
                    const postDataDestination = await dispatch(thunkEditList(destinationList))
                    if (!postDataDestination.errors) {
                        return
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (document.getElementById('new-list-input')) {
            document.getElementById('new-list-input').focus()
        }
    }, [showNewList])

    const handleNewListSubmit = async (e) => {
        e.preventDefault()
        setShowNewList(false)
        if (newListName) {
            await dispatch(thunkAddList({
                name: newListName,
                card_order: '[]'
            }, board.id))
        }
        setNewListName('')
    }

    return (
        <div className='home-page-wrapper'>
            <SideNavbar theme={theme} selection={board.id} />
            <div className='board-page-content'>
                <div className='board-header'>
                    {board.name}
                    <OpenModalButton modalComponent={<BoardModal type="Edit" />}
                        buttonText={
                            <p><i className="fa-solid fa-pen-to-square"></i> Edit board</p>
                        }
                    />
                </div>
                <div className='list-area-wrapper'>
                    <DragDropContext
                        onDragEnd={onDragEnd}
                    >
                        <Droppable droppableId={`board-${board.id}`} direction='horizontal' type='list'>
                            {provided => (

                                <div className='lists-wrapper'
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {board.list_order && board.list_order.map((listId, index) => (
                                        <List key={listId} list={board.lists[listId]} cards={board.lists[listId].card_order} index={index} />
                                    ))}
                                    {provided.placeholder}

                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <div className='new-list-wrapper'>
                        {(showNewList) && (<form className='new-list' id='new-list' onSubmit={handleNewListSubmit}>
                            <input
                                id='new-list-input'
                                type="text"
                                placeholder='Enter list title...'
                                value={newListName}
                                onChange={e => setNewListName(e.target.value)}
                            />
                        </form>)}
                        {(!showNewList) && (
                            <button className='add-list-button' onClick={() => setShowNewList(true)}><i className="fa-solid fa-plus"></i> Add another list</button>
                        )}
                        {(showNewList) && (
                            <div className="cover-everything" onClick={handleNewListSubmit} />
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}