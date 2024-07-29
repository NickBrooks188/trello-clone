import { useEffect, useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    document.title = 'Jello: Log in'
  }, [])

  useEffect(() => {
    if (email && password) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email, password])

  const demoLogin = () => {
    dispatch(
      thunkLogin({
        email: 'demo@aa.io',
        password: 'password',
      }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  if (sessionUser) return <Navigate to="/" replace={true} />;

  return (
    <div className="login-wrapper">
      <h1>Log In</h1>
      <a href='https://workspace-deployed.onrender.com/api/auth/oauth_login' className="google-link"><button className="google-button"><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'></img>Log in with Google</button></a>

      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <p>{errors.email}</p>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <p>{errors.password}</p>
        <button type="submit" disabled={disabled}>Log In</button>

      </form>
      <button className='signup-page-button' onClick={demoLogin}>Log in as demo user</button>
    </div>
  );
}

export default LoginFormPage;
