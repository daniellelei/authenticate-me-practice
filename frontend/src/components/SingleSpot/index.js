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

    const clickReserve = (e) => {
        e.preventDefault();
        window.alert('Feature Coming Soon')
    }

    return (
        <div className="wholePage">
            <div className="singleSpot">
                <h1 className="spotName">{spot.name}</h1>
                <div className="locationInfo">
                    <span>{spot.city}</span>
                    <span>{spot.state}</span>
                    <span>{spot.country}</span>  
                </div>
                <div className="images">
                <img src={spot.SpotImages[0].url}  alt= {spot.SpotImages[0].url}/> 
                </div>
                <div className="details">
                    <span>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</span>
                    <p>{spot.description}</p>
                </div>
                
            </div>
            <div className="callOut">
                <p>${spot.price} night</p>
                <button onClick={clickReserve}>Reserve</button>
            </div>
        </div>
    )

}

export default SingleSpot;