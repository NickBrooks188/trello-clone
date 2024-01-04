import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import './HomePage.css'

export default function HomePage() {

    const sessionUser = useSelector(state => state.session.user)

    if (!sessionUser) return <Navigate to="/" replace={true} />;


    return "Home page"
}