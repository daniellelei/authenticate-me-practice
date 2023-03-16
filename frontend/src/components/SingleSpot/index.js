import { useParams } from "react-router-dom";
import './SingleSpot.css';
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpotThunk } from "../../store/spots";
import { loadReviewThunk } from "../../store/reviews";
import { useEffect } from "react";
import DeleteModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/index'
import CreateReviewModal from "../CreateReviewModal";


const SingleSpot = () => {
    const { spotId }  = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state=>state.spots.singleSpot);
    let reviews = useSelector(state => state.reviews.reviews);
    reviews = Object.values(reviews);

    useEffect(()=>{
        dispatch(loadOneSpotThunk(spotId));
        dispatch(loadReviewThunk(spotId));
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
                            
                            <p>{spot.avgStarRating}<i class="fa-sharp fa-solid fa-star"></i>  {spot.numReviews}reviews</p>
                        </div>
                        <button onClick={clickReserve} className="reserve">Reserve</button>
                    </div>
                </div>

                <div className="reviews">
                    <div>
                        <OpenModalButton 
                            buttonText= 'Post a review'
                            modalComponent={<CreateReviewModal spot={spot}/>}
                        />

                    </div>
                    {reviews.map((review)=> (
                        <div>
                            <h4>{review.User.firstName}</h4>
                            <h4>{review.createdAt}</h4>
                            <p>{review.review}</p>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    )

}

export default SingleSpot;