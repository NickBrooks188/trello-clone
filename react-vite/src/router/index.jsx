import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from './Layout';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import HomePage from '../components/HomePage';
import LoggedOutPage from '../components/LoggedOutPage';
import PageNotFound from '../components/PageNotFound';
import BoardPage from '../components/BoardPage';

export const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path="/" element={<LoggedOutPage />} />
    <Route path="/login" element={<LoginFormPage />} />
    <Route path="/signup" element={<SignupFormPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/boards/:boardId" element={<BoardPage />}>
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Route>
))