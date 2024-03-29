import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';
import './HomePage.css'
import { useEffect, useState } from 'react';
import BoardTile from '../BoardTile';
import BoardModal from '../BoardModal';
import OpenModalButton from '../OpenModalButton';
import { removeBoard, thunkAddUserToBoard } from '../../redux/board';

export default function HomePage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const boards = useSelector(state => state.boards)
    const [userBoards, setUserBoards] = useState([])
    const [unjoinedBoards, setUnjoinedBoards] = useState([])

    // Load boards that a user has access to
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
        document.title = 'Jello: Home'
    }, [dispatch])

    const joinBoard = (boardId) => {
        dispatch(thunkAddUserToBoard(sessionUser, boardId))
    }

    if (!sessionUser) return <Navigate to="/" replace={true} />;

    return (
        <>
            <div className='home-page-content'>
                <h1>Your boards</h1>
                <div className='home-boards-wrapper'>
                    {userBoards.map(userBoard => (
                        <div className='board-tile-wrapper' key={`joined-${userBoard.id}`}>
                            <Link to={`/main/boards/${userBoard.id}`}>
                                <BoardTile board={userBoard} type="joined" />
                            </Link>
                        </div>
                    ))}
                    <div className='board-tile-wrapper'>
                        <OpenModalButton
                            bg='none'
                            modalComponent={<BoardModal type="Create" />}
                            buttonText={
                                <span>
                                    <i className="fa-solid fa-plus"></i>Create a new board
                                </span>
                            }
                        />
                    </div>
                </div>
                <h1>Join a board</h1>
                <div className='home-boards-wrapper'>
                    {unjoinedBoards.map(unjoinedBoard => (
                        <div className='board-tile-wrapper' key={`unjoined-${unjoinedBoard.id}`}>
                            <Link className='board-click' onClick={() => joinBoard(unjoinedBoard.id)} key={unjoinedBoard.id}>
                                <BoardTile board={unjoinedBoard} type="unjoined" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}