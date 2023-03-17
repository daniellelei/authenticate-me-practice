// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  

  return (
    <ul className='headNav'>
      <li className='home'>
        <NavLink style={{textDecoration: 'none'}} exact to="/">
          <div className='iconName'>
            <img className='icon' src='https://cdn-icons-png.flaticon.com/128/3281/3281223.png'/>
            <h4 className='apiName'>tree house bnb</h4>
          </div>
          {/* <i class="fa-solid fa-house"></i> */}
        </NavLink>
      </li>
      <div className='navRight'>
      {sessionUser ?
      (<li className='createSpot'>
        <NavLink exact to='/spots/new'>Create a New Spot
        </NavLink>
      </li>
      ) : (null)}
      {isLoaded && (
        <li className='profileButton'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      </div>
      
    </ul>
  );
}

export default Navigation;