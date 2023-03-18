import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const session = useSelector(state => state.session.user) 
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState([]);
  const [resErrors, setResErrors] = useState({});
  const { closeModal } = useModal();
  

  useEffect(()=>{
    const err = [];
    if(!email.length) err.push('Invalid email');
    if(!firstName.length ) err.push('First name is required');
    if(!lastName.length) err.push('Last name is required');
    if(username.length < 4) err.push ('username needs to be at least 4 characters.')
    if(password.length < 6) err.push('password needs to be at least 6 characters.');
    if(password!==confirmPassword) err.push('Confirm Password field must be the same as the Password field')
    setErrors(err);
  }, [email, firstName, lastName, username, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('errors', errors);
    // setShowErrors(errors);
    // console.log('showError', showErrors);
    setErrors([]);
    setResErrors({});
    
    if(password===confirmPassword){
      dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(closeModal)
      .catch(async (res) => {
          const data = await res.json();
          console.log('catch', data)
          if (data && data.errors) {
            console.log('data.errors', data.errors)
            setResErrors(data.errors);
          }
        });
    } else {
      setResErrors(['Confirm Password field must be the same as the Password field'])
    }
  
  }
  
  return (
    <div className="signupModal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className='signUpForm'>
        <ul>
          {/* {showErrors.map((error, idx) => <li key={idx}>{error}</li>)} */}
          {Boolean(Object.values(resErrors).length) ? <li>{Object.values(resErrors)}</li> : null}
        </ul>
        <div className="signUpLabel">
          <label>
            Email
            <input
              className="signUpInput"
              type="text"
              value={email}
              // onChange={(e) => setEmail(e.target.value)}
              onChange={(e)=> setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="signUpLabel">
          <label>
            Username
            <input
              className="signUpInput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="signUpLabel">
          <label>
            First Name
            <input
              className="signUpInput"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="signUpLabel">
          <label>
            Last Name
            <input
              type="text"
              className="signUpInput"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="signUpLabel">
          <label>
            Password
            <input
              type="password"
              className="signUpInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="signUpLabel">
          <label>
            Confirm Password
            <input
              type="password"
              className="signUpInput"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button 
        type="submit"
        disabled={Boolean(Object.values(errors).length)}
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;