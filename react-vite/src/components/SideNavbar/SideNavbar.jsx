import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './SideNavbar.css'
import { useEffect, useState } from 'react'
import { thunkLoadAllBoards } from '../../redux/all_boards'
import { thunkLoadAllThemes } from '../../redux/themes'

export default function SideNavbar() {
    const selection = useParams()?.boardId || 'boards'
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const themes = useSelector(state => state.themes)
    const boards = useSelector(state => state.boards)
    const theme = boards[selection]?.theme
    const [userBoards, setUserBoards] = useState([])
    const [navbarFontColor, setNavbarFontColor] = useState(theme?.header_font_color || '#172B4E')
    const [showSideNavbar, setShowSideNavbar] = useState(true)

    useEffect(() => {
        setNavbarFontColor(theme?.header_font_color)
        document.documentElement.className = `theme-${(theme?.header_font_color === '#FFFFFF' ? 'light' : 'dark')}`;
    }, [theme])

    useEffect(() => {
        dispatch((thunkLoadAllBoards()))
        dispatch((thunkLoadAllThemes()))
    }, [dispatch])

    useEffect(() => {
        let userBoardArr = []
        for (let board of Object.values(boards)) {
            if (board?.users[sessionUser?.id]) userBoardArr.push(board)
        }
        setUserBoards(userBoardArr)
    }, [boards, sessionUser])

    return (
        <div className={`side-navbar-wrapper${showSideNavbar ? '' : ' minimize-side-navbar'}`} style={{
            'color': navbarFontColor,
            'backgroundColor': theme?.header_color || '#FFFFFF'
        }}>
            <div className='side-navbar-toggle' onClick={() => setShowSideNavbar(!showSideNavbar)}><i className={`fa-solid fa-chevron-${showSideNavbar ? 'left' : 'right'}`}></i></div>
            <Link className={`boards-link${selection === 'boards' ? ' selected' : ''}`} to='/main/home'> <i className="fa-brands fa-trello"></i>Boards</Link>
            <h3>Your boards</h3>
            <ul className='user-boards'>
                {userBoards.map(userBoard => (
                    <li id={`board${userBoard.id}`} key={userBoard.id} className={`board-li${selection == userBoard.id ? ' selected' : ''}`}>
                        <Link to={`/main/boards/${userBoard.id}`} style={{
                            'color': navbarFontColor
                        }}>
                            <div className='user-board-navbar-preview'
                                style={{
                                    'backgroundImage': (themes[userBoard.theme_id]?.background_image_url ? `url(${themes[userBoard.theme_id]?.background_image_url})` : `linear-gradient(0.37turn, ${themes[userBoard.theme_id]?.gradient_left} , ${themes[userBoard.theme_id]?.gradient_right} )`),
                                    'backgroundSize': `cover`
                                }} />

                            <div className='user-board-navbar-name'>{userBoard.name}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}