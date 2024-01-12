import './LoggedOutPage.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { thunkLogin } from '../../redux/session'
import { removeBoard } from '../../redux/board'
import { clearBoards } from '../../redux/all_boards'

export default function LoggedOutPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(removeBoard())
        dispatch(clearBoards())
    })

    const demoLogin = () => {
        dispatch(
            thunkLogin({
                email: 'demo@aa.io',
                password: 'password',
            }))
    }

    if (sessionUser) return <Navigate to="/home" replace={true} />;

    return (
        <div className='logged-out-page-wrapper'>
            <div className='logged-out-wrapper'>
                <Link className="login-page-button" to='/login'>Log in</Link>
                <Link className="signup-page-button" to='/signup'>Sign up</Link>
                <div className='divider' />
                <button className='demo-user-button' onClick={demoLogin}>Log in as demo user</button>
            </div>
            <div className='footer'>
                Created by: <Link to='https://github.com/NickBrooks188'><i className="fa-brands fa-github"></i> NickBrooks188</Link>
            </div>
        </div>
    )
}