import { addBoards, editBoards, removeBoards, addUserToBoards } from "./all_boards";

const GET_BOARD = 'board/getBoard'
const ADD_BOARD = 'board/addBoard'
const REMOVE_BOARD = 'board/removeBoard'
const EDIT_BOARD = 'board/editBoard'
const ADD_LIST = 'list/addList'
const REMOVE_LIST = 'list/removeList'
const EDIT_LIST = 'list/editList'
const ADD_CARD = 'card/addCard'
const REMOVE_CARD = 'card/removeCard'
const EDIT_CARD = 'card/editCard'
const ADD_USER_TO_CARD = 'session/addUserToCard'

const loadBoard = (board) => {
    return {
        type: GET_BOARD,
        board
    }
}

const addBoard = (board) => {
    return {
        type: ADD_BOARD,
        board
    }
}

const removeBoard = () => {
    return {
        type: REMOVE_BOARD
    }
}

const editBoard = (board) => {
    return {
        type: EDIT_BOARD,
        board
    }
}

const addList = (list) => {
    return {
        type: ADD_LIST,
        list
    }
}

const removeList = (listId) => {
    return {
        type: REMOVE_LIST,
        listId
    }
}

const editList = (list) => {
    return {
        type: EDIT_LIST,
        list
    }
}

const addCard = (card, listId) => {
    return {
        type: ADD_CARD,
        card,
        listId
    }
}

const removeCard = (cardId, listId) => {
    return {
        type: REMOVE_CARD,
        cardId,
        listId
    }
}

const editCard = (card, listId) => {
    return {
        type: EDIT_CARD,
        card,
        listId
    }
}

const addUserToCard = (user, listId, cardId) => {
    return {
        type: ADD_USER_TO_CARD,
        user,
        listId,
        cardId
    }
}

export const thunkLoadBoard = (boardId) => async (dispatch) => {
    const res = await fetch(`/api/boards/${boardId}`)
    const data = await res.json()
    if (res.ok) {
        dispatch(loadBoard(data))
    }
    return data
}

export const thunkAddBoard = (board) => async (dispatch) => {
    const res = await fetch(`/api/boards/`, {
        method: "POST",
        body: JSON.stringify(board),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(addBoard(data))
        delete data.lists
        dispatch(addBoards(data))
    }
    return data
}

export const thunkRemoveBoard = (boardId) => async (dispatch) => {
    const res = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(removeBoard(boardId))
        dispatch(removeBoards(boardId))
    }
    return res
}

export const thunkEditBoard = (board) => async (dispatch) => {
    const res = await fetch(`/api/boards/${board.id}`, {
        method: "PUT",
        body: JSON.stringify(board),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = res.json()
    if (res.ok) {
        dispatch(editBoard(data))
        delete data.lists
        dispatch(editBoards(data))
    }
    return data
}

export const thunkAddList = (list, boardId) => async (dispatch) => {
    const res = await fetch(`/api/boards/${boardId}`, {
        method: "POST",
        body: JSON.stringify(list),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(addList(data))
    }
    return data
}

export const thunkRemoveList = (listId) => async (dispatch) => {
    const res = await fetch(`/api/lists/${listId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(removeList(listId))
    }
    return res
}

export const thunkEditList = (list) => async (dispatch) => {
    const res = await fetch(`/api/lists/${list.id}`, {
        method: "PUT",
        body: JSON.stringify(list),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(editList(data))
    }
    return data
}
export const thunkAddCard = (card, listId) => async (dispatch) => {
    const res = await fetch(`/api/lists/${listId}/cards`, {
        method: "POST",
        body: JSON.stringify(card),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(addCard(data, listId))
    }
    return data
}

export const thunkRemoveCard = (cardId, listId) => async (dispatch) => {
    const res = await fetch(`/api/cards/${cardId}/`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(removeCard(cardId, listId))
    }
    return res
}

export const thunkEditCard = (card, listId) => async (dispatch) => {
    const res = await fetch(`/api/cards/${card.id}`, {
        method: "PUT",
        body: JSON.stringify(card),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = res.json()
    if (res.ok) {
        dispatch(editCard(data, listId))
    }
    return data
}

export const thunkAddUserToBoard = (user, boardId) => async (dispatch) => {
    const res = await fetch(`/api/boards/${boardId}/users`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(addUserToBoards(user, boardId))
    }
    return data
}

export const thunkAddUserToCard = (user, listId, cardId) => async (dispatch) => {
    const res = await fetch(`/api/cards/${cardId}`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(addUserToCard(data, listId, cardId))
    }
    return data
}

const initialState = {}

const boardReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BOARD: {
            const newState = {}
            newState.id = action.board.id
            newState.owner_id = action.board.owner_id
            newState.theme_id = action.board.theme_id
            newState.name = action.board.name
            newState.description = action.board.description
            newState.list_order = action.board.list_order
            newState.users = action.board.users
            newState.lists = {}
            for (let list of action.board.lists) {
                newState.lists[list.id] = { ...list, cards: {} }
                for (let card of list.cards) {
                    newState.lists[list.id].cards[card.id] = { ...card, users: {} }
                    for (let user of card.users) {
                        newState.lists[list.id].cards[card.id].users[user.id] = user
                    }
                }
            }
            return newState
        }
        case ADD_BOARD: {
            const newState = {}
            newState.id = action.board.id
            newState.owner_id = action.board.owner_id
            newState.theme_id = action.board.theme_id
            newState.name = action.board.name
            newState.description = action.board.description
            newState.list_order = "[]"
            newState.users = action.board.users
            newState.lists = {}
            newState.users[action.board.users[0].id] = action.board.users[0]
            return newState
        }
        case REMOVE_BOARD: {
            return {}
        }
        case EDIT_BOARD: {
            const newState = { ...state }
            newState.theme_id = action.board.theme_id
            newState.name = action.board.name
            newState.description = action.board.description
            newState.list_order = action.board.list_order
            return newState
        }
        case ADD_LIST: {
            const newState = { ...state }
            newState.lists[action.list.id] = action.list
            newState.lists[action.list.id].cards = {}
            let oldList = JSON.parse(newState.list_order)
            oldList.push(action.list.id)
            newState.list_order = JSON.stringify(oldList)
            return newState
        }
        case REMOVE_LIST: {
            const newState = { ...state }
            delete newState.lists[action.listId]
            return newState
        }
        case EDIT_LIST: {
            const newState = { ...state }
            newState.lists[action.list.id].name = action.list.name
            return newState
        }
        case ADD_CARD: {
            const newState = { ...state }
            newState.lists[action.listId].cards[action.card.id] = action.card
            newState.lists[action.listId].cards[action.card.id].users = {}
            return newState
        }
        case REMOVE_CARD: {
            const newState = { ...state }
            delete newState.lists[action.listId].cards[action.cardId]
            return newState
        }
        case EDIT_CARD: {
            const newState = { ...state }
            newState.lists[action.listId].cards[action.card.id].name = action.card.name
            newState.lists[action.listId].cards[action.card.id].description = action.card.description
            newState.lists[action.listId].cards[action.card.id].label = action.card.label
            newState.lists[action.listId].cards[action.card.id].image_url = action.card.image_url
            for (let user of action.card.users) {
                newState.lists[action.listId].cards[action.card.id].users[user.id] = user
            }
            return newState
        }
        case ADD_USER_TO_CARD: {
            const newState = { ...state }
            newState.lists[action.listId].cards[action.cardId].users[action.user.id] = action.user
            return newState
        }
        default:
            return state
    }
}

export default boardReducer