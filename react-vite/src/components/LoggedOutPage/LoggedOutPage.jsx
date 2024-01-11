import './LoggedOutPage.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { thunkLogin } from '../../redux/session'
import { removeBoard } from '../../redux/board'

export default function LoggedOutPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(removeBoard())
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
        <div className='logged-out-wrapper'>
            <Link className="login-page-button" to='/login'>Log in</Link>
            <Link className="signup-page-button" to='/signup'>Sign up</Link>
            <div className='divider' />
            <button className='demo-user-button' onClick={demoLogin}>Log in as demo user</button>
        </div>
    )
}