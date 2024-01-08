import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';
import './HomePage.css'
import SideNavbar from '../SideNavbar';
import { useEffect, useState } from 'react';
import BoardTile from '../BoardTile';
import BoardModal from '../BoardModal';
import OpenModalButton from '../OpenModalButton';
import { removeBoard, thunkAddUserToBoard } from '../../redux/board';

export default function HomePage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const themes = useSelector(state => state.themes)
    const boards = useSelector(state => state.boards)
    const [userBoards, setUserBoards] = useState([])
    const [unjoinedBoards, setUnjoinedBoards] = useState([])

    useEffect(() => {
        let userBoardArr = []
        let nonUserBoardArr = []
        if (sessionUser) {
            for (let board of Object.values(boards)) {
                if (board.users[sessionUser.id]) userBoardArr.push(board)
                else nonUserBoardArr.push(board)
            }
            setUserBoards(userBoardArr)
            setUnjoinedBoards(nonUserBoardArr)
        }
    }, [boards, sessionUser])

    useEffect(() => {
        dispatch(removeBoard())
    })

    const joinBoard = (boardId) => {
        dispatch(thunkAddUserToBoard(sessionUser, boardId))
    }


    if (!sessionUser) return <Navigate to="/" replace={true} />;

    return (
        <div className='home-page-wrapper'>
            <SideNavbar selection={'boards'} />
            <div className='home-page-content'>
                <h1>Your boards</h1>
                <div className='home-user-boards-wrapper'>
                    {userBoards.map(userBoard => (
                        <Link to={`/boards/${userBoard.id}`} key={userBoard.id}>
                            <BoardTile board={userBoard} />
                        </Link>
                    ))}
                    <OpenModalButton
                        bg='none'
                        modalComponent={<BoardModal type="Create" />}
                        buttonText={
                            <p>
                                <i className="fa-solid fa-plus"></i>Create a board
                            </p>
                        }
                    />
                </div>
                <h1>Join a board</h1>
                <div className='home-unjoined-boards-wrapper'>
                    {unjoinedBoards.map(unjoinedBoard => (
                        <div onClick={() => joinBoard(unjoinedBoard.id)} key={unjoinedBoard.id}>
                            <BoardTile board={unjoinedBoard} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}