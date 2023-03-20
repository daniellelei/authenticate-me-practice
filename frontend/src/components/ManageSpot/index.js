import React from 'react';
import './ManageSpot.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpotThunk, loadSpotsCurrentThunk, clearCurrentSpotAction } from '../../store/spots';
import { NavLink, useHistory, Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateSpot from '../CreateSpot';
import DeleteModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/index'
// import '../SpotsIndex/SpotsIndex.css';


const CurrentUserSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotsObj = useSelector(state => state.spots.currentSpots);
    //console.log('first spotObj', spotsObj)
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
            <div >
                <div className='topm'>
                <h1>Manage Your Spots</h1>
                <button>Create a New Spot</button>
                </div>
                <div className='spots-indexm'>
                <nav>
                    {spots.map((spot) => (
                        <div className='spotm'>
                            <NavLink key={spot.id} to={`/spots/${spot.id}`}
                            className='spotNavm tooltip'>
                                <img src={spot.previewImage} alt={spot.name} />
                                <div className='belowImagem'>
                                    <div className='spotim'>
                                        <div className = 'infom'>
                                            <h4 className='tooltip tooltiptext'>{spot.name}</h4>
                                            <h4 className='cityStatem'>{spot.city}, {spot.state}</h4>
                                        </div>
                                        <div className='price-nightm'>
                                            <h4 className='pricem'> ${spot.price}</h4> 
                                            <h4 className='nightm'>night</h4>
                                        </div>
                                    </div>
                                    <div className='ratingm'>
                                            {!spot.avgRating ? 
                                            <h4 className='revm'> New </h4> : 
                                            (<div className='ratingStarm revm'>
                                                <i class="fa-sharp fa-solid fa-star"></i>
                                                <h4 className='spotRatem'>{Number.parseFloat(spot.avgRating).toFixed(1)}</h4>
                                            </div>)}
                                        </div>
                                </div>
                            </NavLink>
                                <div>
                                    <button onClick={clickUpdate}
                                    className='buttonUpdate'
                                    >
                                        <Link key={spot.id} to={`/spots/${spot.id}/edit`}
                                        style={{textDecoration: 'none'}}
                                        className='linkUpdate'>
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
                
            </div>
        )

    }

    

export default CurrentUserSpots;