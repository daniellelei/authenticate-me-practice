import React from 'react';
import { Link } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Route, Switch, NavLink} from 'react-router-dom';
import { loadAllSpots } from '../../store/spots';
import SingleSpot from '../SingleSpot';
import './SpotsIndex.css'
import * as sessionActions from "../../store/session";


function SpotsIndex() {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state=>state.spots.allSpots);
    // console.log('before restore')
    // const userObj = useSelector(state=>state.session.user);
    // dispatch(sessionActions.restoreUser());
    // console.log('after restore');

    useEffect(()=>{
        dispatch(loadAllSpots());
    },[dispatch])
    if(!spotsObj) return null;
    const spots = Object.values(spotsObj);

    return (
        <div className='spots-index'>
            <nav>
               {spots.map((spot) => (
                <div className='spot'>
                    <NavLink key={spot.id} to={`/spots/${spot.id}`} 
                    className='spotNav tooltip'
                    >
                        <img src={spot.previewImage} alt={spot.name} /> 
                        <div className='spoti'>
                            <div className = 'info'>
                              <h4 className='tooltip tooltiptext'>{spot.name}</h4>
                              <h4 className='cityState'> {spot.city}, {spot.state} </h4>
                              <div className='price-night'>
                                <h4 className='price'> ${spot.price} </h4>   
                                <h4>night</h4>
                              </div>
                            </div>
                            <div className='rating'>
                                {!spot.avgRating ? 
                                <h4> New </h4> : 
                                (<div className='ratingStar'>
                                    <i class="fa-sharp fa-solid fa-star"></i>
                                    <h4 className='spotRate'>{Number.parseFloat(spot.avgRating).toFixed(1)}</h4>
                                </div>)}
                            </div>
                        </div>
                    </NavLink>     
                </div>
            ))} 
            </nav>
        </div>
    )
}

export default SpotsIndex;