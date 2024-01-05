import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './SideNavbar.css'
import { useEffect, useState } from 'react'
import { thunkLoadAllBoards } from '../../redux/all_boards'
import { thunkLoadAllThemes } from '../../redux/themes'

export default function SideNavbar() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const themes = useSelector(state => state.themes)
    const boards = useSelector(state => state.boards)
    const [userBoards, setUserBoards] = useState([])


    useEffect(() => {
        dispatch((thunkLoadAllBoards()))
        dispatch((thunkLoadAllThemes()))
    }, [dispatch])

    useEffect(() => {
        let userBoardArr = []
        for (let board of Object.values(boards)) {
            if (board.users[sessionUser.id]) userBoardArr.push(board)
        }
        setUserBoards(userBoardArr)
    }, [boards, sessionUser])

    return (
        <div className='side-navbar-wrapper'>
            <Link className="boards-link" to='/home'> <i className="fa-brands fa-trello"></i>Boards</Link>
            <h3>Your boards</h3>
            <ul className='user-boards'>
                {userBoards.map(userBoard => (
                    <li id={`board${userBoard.id}`} key={userBoard.id}>
                        <Link to={`/boards/${userBoard.id}`}>
                            <div className='user-board-navbar-preview'>

                            </div>
                            <div className='user-board-navbar-name'>{userBoard.name}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}