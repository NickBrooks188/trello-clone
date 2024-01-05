import './LoggedOutPage.css'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { thunkLogin } from '../../redux/session'

export default function LoggedOutPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)

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
            <button className='demo-user-button' onClick={demoLogin}>Log in as demo user</button>
        </div>
    )
}