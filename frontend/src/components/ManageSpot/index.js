import React from 'react';
import './ManageSpot.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpotThunk, loadSpotsCurrentThunk } from '../../store/spots';
import { NavLink, useHistory, Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateSpot from '../CreateSpot';
import DeleteModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/index'
//import OpenModalMenuItem from './OpenModalMenuItem';


const CurrentUserSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotsObj = useSelector(state => state.spots.currentSpots);
    
    const spots = Object.values(spotsObj);
    
    useEffect(()=> {
        dispatch(loadSpotsCurrentThunk());
    }, [dispatch])
    
    
    if(!spots.length) return (
        <div>
            <h2>There is no spots posted yet</h2>
            <NavLink to={`/spots/new`}>
                <CreateSpot />
                Create a New Spot 
            </NavLink>
        </div>
    );
    
        return (
            <div className='currentSpots'>
                <nav>
                    {spots.map((spot) => (
                        <div>
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
                                    <Link key={spot.id} to={`/spots/${spot.id}/edit`}>
                                        <p>Update</p>
                                    </Link>
                                    
                                    <OpenModalButton 
                                        buttonText= 'Delete'
                                        modalComponent={<DeleteModal spot={spot}/>}
                                        onButtonClick={() => console.log("Greeting initiated")}
                                        onModalClose={() => console.log("Greeting completed")}
                                    />
                                </div>
                        </div>
                    ))}
                </nav>
            </div>
        )

    }

    

export default CurrentUserSpots;