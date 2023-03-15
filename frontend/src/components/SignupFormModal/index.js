import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [resErrors, setResErrors] = useState([]);
  const [showErrors, setShowErrors] = useState([]);
  const { closeModal } = useModal();
  //const [error1, setError1] = useState({});

  useEffect(()=>{
    const err = [];
    if(!email.includes('@')) err.push('invalid email');
    if(!firstName.length) err.push('First name is required');
    if(!lastName.length) err.push('Last name is required');
    if(username.length < 4) err.push ('username needs to be at least 4 characters.')
    if(password.length < 6) err.push('password needs to be at least 6 characters.');
    if(password!==confirmPassword) err.push('Confirm Password field must be the same as the Password field')
    setErrors(err);
  }, [email, firstName, lastName, username, password, confirmPassword])


  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrors(errors);
    setErrors([]);
    
    return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          let err = ['abc'];
          console.log('err', err[0]);
          setResErrors(err);
          console.log('resErrors', resErrors);
          //setShowErrors(errors);
          // console.log(data.message);
          // let err = [];
          // err.push(data.message);
          // console.log('err', err[0]);
          // setErrors(err);
          // //setShowErrors(errors);
          // console.log('showErrors',errors[0])
        }
      });
  }
    
  

  return (
    <div className="signupModal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className='signUpForm'>
        <ul>
          {showErrors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="signUpLabel">
          <label>
            Email
            <input
              className="signUpInput"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;