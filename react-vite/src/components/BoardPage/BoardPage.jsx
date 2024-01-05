import { useDispatch, useSelector } from 'react-redux'
import './BoardPage.css'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SideNavbar from '../SideNavbar'
import { DragDropContext } from 'react-beautiful-dnd';
import List from './List'
import { thunkLoadBoard, thunkEditBoard, thunkEditList, thunkEditCard, moveCard } from '../../redux/board'


export default function BoardPage() {
    const dispatch = useDispatch()
    const { boardId } = useParams()
    const board = useSelector(state => state.board)

    useEffect(() => {
        dispatch(thunkLoadBoard(boardId))
    }, [dispatch, boardId])

    const onDragEnd = async (result) => {

        // result = {
        //     draggableId: cardId,
        //     destination: {
        //         droppableId: destlistId,
        //         index: indexInCard_list
        //     },
        //     source: {
        //         droppableId: sourceListId,
        //         index: indexinCard_list
        //     }
        // }
        const { destination, source } = result

        if (!(result.destination)) {
            return
        }

        if (destination.droppableId === source.droppableId) {
            if (destination.index === source.index) return
            const destIndex = destination.index
            const sourceIndex = source.index
            const listToEdit = board.lists[Number(destination.droppableId)]
            let cardListToEdit = listToEdit.card_order
            const cardId = cardListToEdit[sourceIndex]
            cardListToEdit.splice(sourceIndex, 1)
            cardListToEdit.splice(destIndex, 0, cardId)

            const listToPost = {
                id: listToEdit.id,
                name: listToEdit.name,
                card_order: JSON.stringify(cardListToEdit)
            }
            const postData = await dispatch(thunkEditList(listToPost))
            if (!postData.errors) {
                return
            }
        } else {
            const destIndex = destination.index
            const sourceIndex = source.index
            const sourceList = { ...board.lists[Number(source.droppableId)] }
            const destinationList = { ...board.lists[Number(destination.droppableId)] }
            let sourceCards = sourceList.card_order
            let destinationCards = destinationList.card_order
            const cardId = sourceCards[sourceIndex]
            const card = sourceList.cards[cardId]
            sourceCards.splice(sourceIndex, 1)
            destinationCards.splice(destIndex, 0, cardId)

            sourceList.card_order = JSON.stringify(sourceCards)
            destinationList.card_order = JSON.stringify(destinationCards)
            card.list_id = destinationList.id

            await dispatch(moveCard(card.id, destinationList.id, sourceList.id))
            await dispatch(thunkEditCard(card, card.list_id))
            const postDataRemoval = await dispatch(thunkEditList(sourceList))
            if (!postDataRemoval.errors) {
                const postDataAddition = await dispatch(thunkEditList(destinationList))
                if (!postDataAddition.errors) {
                    return
                }
            }
        }
    }

    return (
        <div className='home-page-wrapper'>
            <SideNavbar />
            <div className='board-page-content'>
                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    {board.list_order && board.list_order.map((listId, index) => (
                        <List key={listId} list={board.lists[listId]} cards={board.lists[listId].card_order} index={index} />
                    ))}
                </DragDropContext>
            </div>
        </div>
    )
}