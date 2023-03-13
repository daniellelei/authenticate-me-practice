import React from 'react';
import { Link } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Route, Switch, NavLink} from 'react-router-dom';
import { loadAllSpots } from '../../store/spots';
import SingleSpot from '../SingleSpot';


function SpotsIndex() {
    const dispatch = useDispatch();
    const spots = useSelector(state=>state.spots.allSpots);

    useEffect(()=>{
        dispatch(loadAllSpots());
    },[dispatch])
    if(!spots) return null;

    return (
        <div className='spots-index'>
            <h2>All Spots</h2>
            <nav>
               {spots.map((spot) => (
                <div>
                    <NavLink key={spot.id} to={`/api/spots/${spot.id}`}>{spot.name}</NavLink>
                    {/* <img src={spot.previewImage} alt={spot.name} />  */}
                    <p> {spot.city} </p>
                    <p> {spot.state} </p>
                    <p> {spot.name} </p>
                    <p> ${spot.price} night </p> 
                    {!spot.avgRating ? <p> New </p> : spot.avgRating}
                </div>
            ))} 
            </nav>

            {/* <Switch>
                <Route path='api/spots/:spotId'>
                    <SingleSpot />
                </Route>
            </Switch> */}
        </div>
    )
}

export default SpotsIndex;