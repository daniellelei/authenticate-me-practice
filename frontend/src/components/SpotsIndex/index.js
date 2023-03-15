import React from 'react';
import { Link } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Route, Switch, NavLink} from 'react-router-dom';
import { loadAllSpots } from '../../store/spots';
import SingleSpot from '../SingleSpot';
import './SpotsIndex.css'


function SpotsIndex() {
    const dispatch = useDispatch();
    const spots = useSelector(state=>state.spots.allSpots);

    useEffect(()=>{
        dispatch(loadAllSpots());
    },[dispatch])
    if(!spots) return null;

    return (
        <div className='spots-index'>
            <nav>
               {spots.map((spot) => (
                <div className='spot'>
                    <NavLink key={spot.id} to={`/spots/${spot.id}`}>
                        <img src={spot.previewImage} alt={spot.name} /> 
                        <div className='spoti'>
                            <div className = 'info'>
                              <h4> {spot.city}, {spot.state} </h4>
                              <h4> ${spot.price} night </h4>   
                            </div>
                            <div className='rating'>
                                {!spot.avgRating ? <h4> New </h4> : <h4>{spot.avgRating}</h4>}
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