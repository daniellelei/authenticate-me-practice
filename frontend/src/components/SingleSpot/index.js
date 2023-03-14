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

    const imagesRender = (images) => {
        for (let i=0; i<images.length; i++){
            images[i].ind = `img${i}`
        }
        return images;
    }
    let images = spot.SpotImages;
    images = imagesRender(images);
    
    return (
        <div className="wholePage">
            <div className="singleSpot">
                <h1 className="spotName">{spot.name}</h1>
                <div className="locationInfo">
                    <span>{spot.city}, {spot.state}, {spot.country} </span> 
                </div>
                <div className="images">
                    {images.map((image) => (
                        <img key={image.id} className={image.ind} src={image.url} />
                    ))}

                   
                </div>
                <div className="belowImage">
                    <div className="details">
                        <span>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</span>
                        <p>{spot.description}</p>
                    </div>
                    <div className="callOut">
                        <div className="price">
                            <p>${spot.price} night</p>
                            <p>{spot.avgStarRating} stars {spot.numReviews} reviews</p>
                        </div>
                        <button onClick={clickReserve} className="reserve">Reserve</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SingleSpot;