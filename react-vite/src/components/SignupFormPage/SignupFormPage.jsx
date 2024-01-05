import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [location, setLocation] = useState("");
  const [profile_image_url, setProfileImageURL] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)


  const validateEmail = (val) => {
    setEmail(val)
    let errorsTemp
    (val.indexOf("@") === -1 || val.indexOf(".") === -1) ?
      errorsTemp = { ...errors, email: "Please provide a valid email" } :
      errorsTemp = { ...errors, email: null }
    setErrors(errorsTemp)
  }

  const validateFirstName = (val) => {
    setFirstname(val)
    let errorsTemp
    (/[^a-zA-Z]/.test(val)) ?
      errorsTemp = { ...errors, first_name: "First name must only contain letters" } :
      errorsTemp = { ...errors, first_name: null }
    setErrors(errorsTemp)
  }

  const validateLastName = (val) => {
    setLastname(val)
    let errorsTemp
    (/[^a-zA-Z]/.test(val)) ? errorsTemp = { ...errors, last_name: "First name must only contain letters" } : errorsTemp = { ...errors, last_name: null }
    setErrors(errorsTemp)
  }

  const validatePassword = (val) => {
    setPassword(val)
    let errorsTemp
    (val.length < 6) ? errorsTemp = { ...errors, password: "Password must be at least 6 characters long" } : errorsTemp = { ...errors, password: null }
    setErrors(errorsTemp)
  }

  const validateConfirmPassword = (val) => {
    setConfirmPassword(val)
    let errorsTemp
    (val !== password) ? errorsTemp = { ...errors, confirmPassword: "Confirm password must match password" } : errorsTemp = { ...errors, confirmPassword: null }
    setErrors(errorsTemp)
  }

  useEffect(() => {
    if ((email && first_name && last_name && password && confirmPassword) && !(errors.email) && !(errors.first_name) && !(errors.last_name) && !(errors.password) && !(errors.confirmPassword)) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email, password, confirmPassword, last_name, first_name, errors])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // return if submit shouldn't have been clicked
    if (disabled) return

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        first_name,
        last_name,
        location: (location || null),
        profile_image_url: (profile_image_url || null),
        password
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  if (sessionUser) return <Navigate to="/home" replace={true} />;

  return (
    <>
      <h1>Sign Up</h1>
      {errors.server && <span>{errors.server}</span>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <span>{errors.email}</span>}
        <label>
          First name
          <input
            type="text"
            value={first_name}
            onChange={(e) => validateFirstName(e.target.value)}
            required
          />
        </label>
        {errors.first_name && <span>{errors.first_name}</span>}
        <label>
          Last name
          <input
            type="text"
            value={last_name}
            onChange={(e) => validateLastName(e.target.value)}
            required
          />
        </label>
        {errors.last_name && <span>{errors.last_name}</span>}
        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        {errors.location && <span>{errors.location}</span>}
        <label>
          Profile picture
          <input
            type="text"
            value={profile_image_url}
            onChange={(e) => setProfileImageURL(e.target.value)}
          />
        </label>
        {errors.profile_image_url && <span>{errors.profile_image_url}</span>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <span>{errors.password}</span>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => validateConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        <button type="submit" disabled={disabled}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormPage;
