import './LoggedOutPage.css'
import { thunkLoadAllBoards } from '../../redux/all_boards'
import { thunkLoadBoard } from '../../redux/board'
import { thunkLoadAllThemes } from '../../redux/themes'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

export default function LoggedOutPage() {
    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(thunkLoadAllBoards())
    //     dispatch(thunkLoadAllThemes())
    //     dispatch(thunkLoadBoard(1))
    // })
    return "Logged out page"
}