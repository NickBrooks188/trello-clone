import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";
import OpenModalMenuItem from "./OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import LoginFormModal from "../LoginFormModal";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user)
  return (
    <div className="top-navbar">
      <NavLink to="/">Logo</NavLink>
      <div className="top-navbar-rhs-wrapper">
        {sessionUser && (
          <ProfileButton />
        )}
        {!sessionUser && (
          <div className="login-signup-wrapper">
            <NavLink to='/login'>Log in</NavLink>
            <NavLink to='/signup'>Sign up</NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
