import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user)
  const board = useSelector(state => state.board)
  const themes = useSelector(state => state.themes)

  return (
    <div className="top-navbar" style={{
      backgroundColor: (themes[board?.theme_id]?.header_color || '#FFF')
    }}>
      <NavLink to="/" className='home-link'>
        <img className="site-logo"
          src={(themes[board?.theme_id]?.header_font_color === '#FFF' ? 'https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Jello-logo-light.png' : 'https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Jello-logo.png')} />
      </NavLink>
      <div className="top-navbar-rhs-wrapper">
        {sessionUser && (
          <ProfileButton />
        )}
        {!sessionUser && (
          <div className="login-signup-wrapper">
            <NavLink to='/login' className='login-navigation'>Log in</NavLink>
            <NavLink to='/signup' className='signup-navigation'>Sign up</NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
