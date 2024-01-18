import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from './Layout';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import HomePage from '../components/HomePage';
import LoggedOutPage from '../components/LoggedOutPage';
import PageNotFound from '../components/PageNotFound';
import BoardPage from '../components/BoardPage';
import SideNavbar from '../components/SideNavbar';

export const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path="/" element={<LoggedOutPage />} />
    <Route path="/login" element={<LoginFormPage />} />
    <Route path="/signup" element={<SignupFormPage />} />

    <Route path='/main' element={
      < div className="home-page-wrapper" >
        <SideNavbar />
        {<Outlet />}
      </div >
    }>
      <Route path="home" element={<HomePage />} />
      <Route path="boards/:boardId" element={<BoardPage />}>
      </Route>
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Route>
))