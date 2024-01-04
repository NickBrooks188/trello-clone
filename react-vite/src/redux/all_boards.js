const GET_ALL_BOARDS = 'boards/getAllBoards'
const ADD_BOARD = 'boards/addBoard'
const EDIT_BOARD = 'boards/editBoard'
const REMOVE_BOARD = 'boards/removeBoard'
const ADD_USER_TO_BOARDS = 'boards/addUserToBoard'

export const getAllBoards = (boards) => {
    return {
        type: GET_ALL_BOARDS,
        boards
    }
}

export const addBoards = (board) => {
    return {
        type: ADD_BOARD,
        board
    }
}


export const editBoards = (board) => {
    return {
        type: EDIT_BOARD,
        board
    }
}

export const removeBoards = (boardId) => {
    return {
        type: REMOVE_BOARD,
        boardId
    }
}

export const addUserToBoards = (user, boardId) => {
    return {
        type: ADD_USER_TO_BOARDS,
        user,
        boardId
    }
}

export const thunkLoadAllBoards = () => async (dispatch) => {
    const res = await fetch('/api/boards')
    const data = await res.json()
    if (res.ok) {
        dispatch(getAllBoards(data))
    }
    return data
}

const initialState = {

}

const allBoardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BOARDS: {
            console.log("~~~~~~~~~~~", action.boards)
            const newState = action.boards
            for (let board of Object.values(action.boards)) {
                newState[board.id].users = {}
                console.log("---------", board.users)
                if (board.users.length) {
                    for (let user of board.users) {
                        newState[board.id].users[user.id] = user
                    }
                } else {
                    newState[board.id].users = {}
                }
            }
            return newState
        }
        case ADD_BOARD: {
            const newState = { ...state }
            newState[action.board.id] = action.board
            return newState
        }
        case EDIT_BOARD: {
            const newState = { ...state }
            newState[action.board.id] = action.board
            return newState
        }
        case REMOVE_BOARD: {
            const newState = { ...state }
            delete newState[action.boardId]
            return newState
        }
        case ADD_USER_TO_BOARDS: {
            const newState = { ...state }
            newState[action.boardId].users[action.user.id] = action.user
            return newState
        }
        default:
            return state
    }
}

export default allBoardsReducer