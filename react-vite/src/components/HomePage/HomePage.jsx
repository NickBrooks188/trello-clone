import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import './HomePage.css'
import SideNavbar from '../SideNavbar';

export default function HomePage() {

    const sessionUser = useSelector(state => state.session.user)

    if (!sessionUser) return <Navigate to="/" replace={true} />;


    return (
        <div className='home-page-wrapper'>
            <SideNavbar />
            <h1>Home page</h1>
        </div>
    )
}