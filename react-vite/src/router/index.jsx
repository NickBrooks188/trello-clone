import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';

export const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<LoginFormPage />} />
    <Route path="/signup" element={<SignupFormPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/boards/:boardId" element={<BoardPage />}>
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Route>


))