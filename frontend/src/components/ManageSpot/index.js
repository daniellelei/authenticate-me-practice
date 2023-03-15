import React from 'react';
import './ManageSpot.css'
import { useDispatch, useSelector } from 'react-redux';
import { loadSpotsCurrent } from '../../store/spots';
import { NavLink, useHistory, Route, Switch} from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateSpot from '../CreateSpot';
import EditSpot from './EditSpot';


const CurrentUserSpots = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.allSpots);
    const history = useHistory();

    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(()=> {
        setShowEditForm(false);
        dispatch(loadSpotsCurrent());
    }, [dispatch])

    const editSpotClick = (e) => {
        e.preventDefault();
        setShowEditForm(true);
        //history.push('/spots/:spotId')
    }

    if(!spots) return (
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
                                <button onClick={editSpotClick}>Update</button>
                                <button>Delete</button>
                            </div>
                        {/* <div>
                            {showEditForm ? <EditSpot spot={spot} /> : null}
                        </div> */}
                    </div>
                ))}
            </nav>
        </div>
    )
    
}
export default CurrentUserSpots;