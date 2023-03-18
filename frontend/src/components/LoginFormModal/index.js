// frontend/src/components/LoginFormModal/index.js
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  
  const { closeModal } = useModal();
  
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState([]);
  const [resErrors, setResErrors] = useState({});

  useEffect(()=>{
    const err = [];
    if(credential.length < 4) err.push = 'userName length';
    if(password.length < 6) err.push = 'password length'; 
    setErrors(err);
  },[credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setErrors([]);
    setResErrors([]);


    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
          const data = await res.json();
          
          if (data.message) {
            setResErrors([data.message])
          };
        }
      );
  };

  const clickDemo =  (e) => {
    e.preventDefault();
    let credential = 'demoUser';
    let password = 'demoUser';
    dispatch(sessionActions.login({credential, password}))
    .then(closeModal) 
  }

  return (
    <div className="loginModal">
      <h1 className="loginTitle">Log In</h1>
      <form onSubmit={handleSubmit} className='loginForm'>
        <ul>
          {/* {showErrors.map((error, idx) => <li key={idx}>{error}</li>)} */}
          {Boolean(Object.values(resErrors).length) ? <li>{Object.values(resErrors)}</li> : null}
        </ul>
        <input 
          className="loginInput"
          placeholder="Username or Email"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          className="loginInput"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
        type="submit"
        className="loginButton"
        disabled={Boolean(Object.values(errors).length)}>
          Log In</button>
        <button
        className="loginButton"
        onClick={clickDemo}
        >Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;

