import React from 'react';
import './ManageSpot.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpotThunk, loadSpotsCurrentThunk, clearCurrentSpotAction } from '../../store/spots';
import { NavLink, useHistory, Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateSpot from '../CreateSpot';
import DeleteModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/index'



const CurrentUserSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotsObj = useSelector(state => state.spots.currentSpots);
    console.log('first spotObj', spotsObj)
    let spots = [];

    useEffect(()=> {       
        dispatch(loadSpotsCurrentThunk());
        return (()=> dispatch(clearCurrentSpotAction()))
    }, [dispatch])

    if(spotsObj!== null && spotsObj!==undefined){
        spots = Object.values(spotsObj);
    }

    const clickUpdate = (e) => {
        e.preventDefault();
    }
    
    if(!spots.length) return (
        <div>
            <h2>There is no spots posted yet</h2>
            <CreateSpot />   
        </div>
    );
    
        return (
            <div className='currentSpotsPage'>
                <h1>Manage Spots</h1>
                <nav className='currentSpots'>
                    {spots.map((spot) => (
                        <div className='currSingleSpot'>
                            <NavLink key={spot.id} to={`/spots/${spot.id}`}>
                                <img src={spot.previewImage} alt={spot.name} />
                                <div>
                                    <h4>{spot.city}, {spot.state}</h4>
                                    <h4> ${spot.price} night </h4> 
                                </div>
                                <div className='rating'>
                                        {!spot.avgRating ? <h4> New </h4> : <h4>{spot.avgRating}</h4>}
                                    </div>
                            </NavLink>
                                <div>
                                    <button onClick={clickUpdate}>
                                        <Link key={spot.id} to={`/spots/${spot.id}/edit`}>
                                        Update
                                        </Link>
                                    </button>
                                    
                                    
                                    

                                    <OpenModalButton 
                                        buttonText= 'Delete'
                                        modalComponent={<DeleteModal spot={spot}/>}
                                    />
                                </div>
                        </div>
                    ))}
                </nav>
            </div>
        )

    }

    

export default CurrentUserSpots;