import { useParams } from "react-router-dom";
import './SingleSpot.css';
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpotThunk } from "../../store/spots";
import { useEffect } from "react";


const SingleSpot = () => {
    const { spotId }  = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state=>state.spots.singleSpot);

    useEffect(()=>{
        dispatch(loadOneSpotThunk(spotId));
    }, [dispatch])
    if(!spot) return null;

    return (
        <div className="singleSpot">
            <h1>{spot.name}</h1>
            <img src={spot.SpotImages[0].url}  alt= {spot.SpotImages[0].url}/>
            <p>{spot.city}</p>
            <p>{spot.state}</p>
            <p>{spot.country}</p>
            <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
            <p>{spot.description}</p>
        </div>
    )

}

export default SingleSpot;