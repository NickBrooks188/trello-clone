const GET_ALL_THEMES = 'themes/getAllThemes'

const getAllThemes = (themes) => {
    return {
        type: GET_ALL_THEMES,
        themes
    }
}

export const thunkGetAllThemes = () => async (dispatch) => {
    const res = await fetch('/api/themes')
    const data = await res.json()
    if (res.ok) {
        dispatch(getAllThemes(data))
    }
    return data
}

const initialState = {}

const allThemesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_THEMES: {
            const newState = action.themes
            return newState
        }
        default:
            return state
    }
}

export default allThemesReducer