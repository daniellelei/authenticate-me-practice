import { useParams } from "react-router-dom";
import './SingleSpot.css';
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpotThunk } from "../../store/spots";
import { loadReviewThunk } from "../../store/reviews";
import { useEffect, useState } from "react";
import DeleteModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/index'
import CreateReviewModal from "../CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import * as bookingsAction from "../../store/bookings"
const SingleSpot = () => {
    const { spotId }  = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state=>state.spots.singleSpot);
    let reviews = useSelector(state => state.reviews.reviews);
    let user = useSelector(state=>state.session.user);
    reviews = Object.values(reviews);//array
    //console.log('reviews', reviews)
    const spotBookings = useSelector(state=>state.bookings.spotBookings)
    const [date, setDate] = useState(new Date()); //array of date
    console.log('date', date)


    
    const displayPostReviewButton = (user, reviews, spot) => {
        if( user===null || user===undefined ) return false;

        for( let r of reviews){
            if(r.userId === user.id)
            return false;
        }
        if(user.id === spot.ownerId) return false;

        return true;
    }
    const displayFirstReview = (user, reviews, spot) => {
        if( user===null || user===undefined ) return false;
        if(Boolean(reviews.length)) return false;
        if(user.id === spot.ownerId) return false;
        return true;

    }
    const displayDelReviewButton = (user, review) => {
        if( user===null || user===undefined ) return false;
        if (user.id === review.userId) return true;
        return false;
    }

    const displayReviewNum = (user) => {
        if ( user===null || user===undefined ) return true;
        return false;
    }

    
    useEffect(()=>{
        dispatch(loadOneSpotThunk(spotId));
        dispatch(loadReviewThunk(spotId));
        dispatch(bookingsAction.thunkGetSpotBookings(spotId))
        return ()=>{
            dispatch(bookingsAction.actionClearSpotBookings())
        }
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

    const reviewNum = (num) => {
        if(num === 1 ) return ` 1 review`
        else return ` ${num} reviews`
    }

    const reviewMonthYear = (moment) => {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let created = new Date(moment);
        let result = `${months[created.getMonth()]} ${created.getFullYear()}`
        return result;
    }

    let spotBookingsArr = [];
    if(spotBookings) spotBookingsArr=Object.values(spotBookings)

    const spotBookingDate = (spotBookingsArr) => {
        let Dates = []
        
        for (let s of spotBookingsArr){
            let start = new Date(s.startDate.replace('-', ' '))
            let end = new Date(s.endDate.replace('-', ' '))
            let startParsed = Date.parse(start)
            let endParsed = Date.parse(end)
            let i = startParsed;
            while (i < endParsed) {
                i = i + 86400000
                let nextday = new Date(i)
                Dates.push(nextday)
            }
            Dates.push(start);
            Dates.push(end);
        }
        return Dates
    }

    console.log('disabled date', spotBookingDate(spotBookingsArr))
    
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
                        <span className="hostName">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</span>
                        <p className="description">{spot.description}</p>
                    </div>
                    
                    <div className="callOut">
                        <div className="price">
                            <div className="priceOnly">
                                <p className="priceP">${spot.price}</p>
                                <p className="night">night</p>
                            </div>
                            {spot.avgStarRating==='No reviews yet' ? 
                            <h4> New </h4> : (
                            <div className="priceReview">
                                <i class="fa-sharp fa-solid fa-star"></i>
                                <h4 className='spotRate'>{Number.parseFloat(spot.avgStarRating).toFixed(1)}</h4>
                                <h4> · </h4>
                                <h4 className='reviewNum'>{reviewNum(spot.numReviews)}</h4>
                            </div>
                            )}
                            
                            
                            {/* <p>{spot.avgStarRating}<i class="fa-sharp fa-solid fa-star"></i>  {spot.numReviews}reviews</p> */}
                        </div>
                        <button onClick={clickReserve} className="reserve">Reserve</button>
                    </div>
                </div>

                <div className="reviews">
                    <div>
                        {spot.avgStarRating==='No reviews yet' ? 
                            <h4> New </h4> : (
                            <div className="priceReview">
                                <i class="fa-sharp fa-solid fa-star"></i>
                                <h4 className='spotRate'>{Number.parseFloat(spot.avgStarRating).toFixed(1)}</h4>
                                <h4> · </h4>
                                <h4 className='reviewNum'>{reviewNum(spot.numReviews)}</h4>
                            </div>
                            )}
                        
                        {displayFirstReview (user, reviews, spot) ? 
                        <h4>Be the first to post a review!</h4> : null
                        }
                        {displayPostReviewButton(user, reviews, spot) ? 
                        <OpenModalButton 
                            buttonText= 'Post a review'
                            modalComponent={<CreateReviewModal spot={spot}/>}
                        /> : null
                        }

                    </div>
                    {reviews.map((review)=> (
                        <div>
                            <h4 className="reviewer">{review.User.firstName}</h4>
                            <h4 className="reviewTime">{reviewMonthYear(review.createdAt)}</h4>
                            <h4 className="reviewContent">{review.review}</h4>
                            {displayDelReviewButton(user, review) ? 
                            <OpenModalButton 
                                buttonText= 'Delete'
                                modalComponent={<DeleteReviewModal review={review} spotId={spotId} />}
                            /> : null
                            }
                            
                        </div>
                        
                    ))}
                </div>
            </div>
            <div>
                <h4>Booking for this spot</h4>
                <div>
                    {!spotBookingsArr.length ? <h4>There is no booking for this spot yet.</h4> :
                        spotBookingsArr.map ((b)=> (
                            <div key={b}>
                                
                                <p>Start Date: {b.startDate}</p>
                                <p>End Date: {b.endDate}</p>
                                

                            </div>
                        ))
                    }
                </div>

            </div>
            <div className='calendar-container'>
                        <Calendar
                            // minDate={new Date()}
                            onChange={setDate}
                            value={date}
                            selectRange={true}
                            tileDisabled={ ({date, view}) =>
                                // ({date})=> spotBookingDate(spotBookingsArr).includes(date.getDate()) 
                                (view === 'month') && // Block day tiles only
                                spotBookingDate(spotBookingsArr).some(disabledDate =>
                                date.getFullYear() === disabledDate.getFullYear() &&
                                date.getMonth() === disabledDate.getMonth() &&
                                date.getDate() === disabledDate.getDate()
                                )

                        }
                        />
            </div>
            {date.length > 0 ? (
                <p className='text-center'>
                <span className='bold'>Start:</span>{' '}
                {date[0].toDateString()}
                &nbsp;|&nbsp;
                <span className='bold'>End:</span> {date[1].toDateString()}
                </p>
            ) : (
                <p className='text-center'>
                <span className='bold'>Default selected date:</span>{' '}
                {date.toDateString()}
                </p>
            )}
            
        </div>
    )

}

export default SingleSpot;