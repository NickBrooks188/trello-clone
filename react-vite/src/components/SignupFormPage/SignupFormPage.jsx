import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import './SignupForm.css'
import { uploadImage } from "../../redux/board";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)


  useEffect(() => {
    document.title = 'Jello: Sign up'
  }, [])

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
    (val.length < 6) ? errorsTemp = { ...errors, password: "Password must be min 6 characters long" } : errorsTemp = { ...errors, password: null }
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

    let returnImage
    if (image) {
      const formData = new FormData()
      formData.append("image", image)
      returnImage = await dispatch(uploadImage(formData))
      if (returnImage.errors) {
        let errorsTemp = { ...errors, image: returnImage.errors.image }
        setErrors(errorsTemp)
        return
      }
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        first_name,
        last_name,
        location: (location || null),
        profile_image_url: (returnImage?.url || null),
        password
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/main/home");
    }
  };

  if (sessionUser) return <Navigate to="/home" replace={true} />;

  return (
    <div className="signup-wrapper">
      <h1>Sign Up</h1>
      <a href='https://workspace-deployed.onrender.com/api/auth/oauth_login' className="google-link"><button className="google-button"><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'></img>Sign up with Google</button></a>

      <form onSubmit={handleSubmit}>
        <label>
          Email<span className='asterisk'>*</span>
          <input
            type="text"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            required
          />
        </label>
        <p>{errors.email}</p>
        <label>
          First name<span className='asterisk'>*</span>
          <input
            type="text"
            value={first_name}
            onChange={(e) => validateFirstName(e.target.value)}
            required
          />
        </label>
        <p>{errors.first_name}</p>
        <label>
          Last name<span className='asterisk'>*</span>
          <input
            type="text"
            value={last_name}
            onChange={(e) => validateLastName(e.target.value)}
            required
          />
        </label>
        <p>{errors.last_name}</p>
        <label>
          Location (optional)
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <p>{errors.location}</p>
        <label>
          Profile picture (optional)
          <div className="signup-file-upload-wrapper">
            <input
              type="file"
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        </label>
        <p>{errors.image}</p>
        <label>
          Password<span className='asterisk'>*</span>
          <input
            type="password"
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
            required
          />
        </label>
        <p>{errors.password}</p>
        <label>
          Confirm Password<span className='asterisk'>*</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => validateConfirmPassword(e.target.value)}
            required
          />
        </label>
        <p>{errors.confirmPassword}</p>
        <button type="submit" disabled={disabled} >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
