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
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [error1, setError1] = useState({});

  useEffect(()=>{
    const err = {};
    if(credential.length < 4) err.credential = 'userName length';
    if(password.length < 6) err.password = 'password length'; 
    setError1(err);
  },[credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          
          if (data.message) {
            setErrors([data.message])
          };
        }
      );
  };

  return (
    <div className="loginModal">
      <h1 className="loginTitle">Log In</h1>
      <form onSubmit={handleSubmit} className='loginForm'>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
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
        disabled={Boolean(Object.values(error1).length)}>
          Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;

