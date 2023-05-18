import { useParams, useHistory } from "react-router-dom";
import './SingleSpot.css';
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpotThunk } from "../../store/spots";
import { loadReviewThunk } from "../../store/reviews";
import { useEffect, useState, useRef } from "react";
import DeleteModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/index'
import CreateReviewModal from "../CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import {DateRange} from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as bookingsAction from "../../store/bookings"
const SingleSpot = () => {
    const { spotId }  = useParams();
    const dispatch = useDispatch();
    const history = useHistory()
    const ulRef = useRef();
    const spot = useSelector(state=>state.spots.singleSpot);
    let reviews = useSelector(state => state.reviews.reviews);
    let user = useSelector(state=>state.session.user);
    reviews = Object.values(reviews);//array
    const [resErrors, setResErrors] = useState({});
    
    const spotBookings = useSelector(state=>state.bookings.spotBookings)
    const [date, setDate] = useState([
        {
        startDate: new Date(),
        endDate: null,
        key: 'selection'
        }
    ]);
    const [startDate, setStartDate] = useState(date[0].startDate)
    const [endDate, setEndDate] = useState(date[0].endDate)
    // console.log('date', date)
    // console.log('start date', date[0].startDate)
    // console.log('end date', date[0].endDate)
    const [showDropDown, setShowDropDown] = useState(false);
    const openDropDown = () => {
        if(showDropDown) return;
        setShowDropDown(true);
    }
    useEffect(()=> {
        if(!showDropDown) return;
        const closeMenu =(e)=> {
            if(!ulRef.current?.contains(e.target)) {
                setShowDropDown(false)
            }
        }
        document.addEventListener("click", closeMenu);

        return ()=>document.removeEventListener("click", closeMenu)
    }, [showDropDown])

    const showDropDownName = "dropdown" + (showDropDown ? "" : " hidden");
    
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
    const selectedDateMonthYear = (moment) => {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let created = new Date(moment);
        let result = `${created.getDate()}/${months[created.getMonth()]}/${created.getFullYear()}`
        return result;
    }

    let spotBookingsArr = [];
    if(spotBookings) spotBookingsArr=Object.values(spotBookings)

    const spotBookingDate = (spotBookingsArr) => {
        let Dates = []
        // console.log('spotBoookingsArr', spotBookingsArr)
        if(!spotBookingsArr.length) return []
        for (let s of spotBookingsArr){
            // console.log('inside spotBookingDate function,', s.startDate)
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
    const nightCounter = (startDate, endDate) => {
        if(endDate === null) return 0
        let start = new Date(startDate)
        start = Date.parse(start)
        let end = new Date(endDate)
        end = Date.parse(end)
        let i = 0;
        i = (end - start) / 86400000;
        return i
        
    }

    const handleReserve = async (e) => {
        e.preventDefault();
        let startString = date[0].startDate.toISOString()
        let endString = date[0].endDate.toISOString()
        setStartDate(startString.substring(0,10))
        setEndDate(endString.substring(0,10))
        console.log('startDate when reserve', startDate)
        console.log('endDate when reserve', endDate)

        const newBooking = {
            startDate,
            endDate,
        };
        const bookingRes = await dispatch(bookingsAction.thunkAddBooking(spotId, newBooking))
        if(!bookingRes.errors){
            history.push(`/bookings/current`)
        } else {
            await setResErrors(bookingRes.errors);
            console.log('resError', resErrors)
        }
    }

    
    
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
                                <i className="fa-sharp fa-solid fa-star"></i>
                                <h4 className='spotRate'>{Number.parseFloat(spot.avgStarRating).toFixed(1)}</h4>
                                <h4> · </h4>
                                <h4 className='reviewNum'>{reviewNum(spot.numReviews)}</h4>
                            </div>
                            )}
                        </div>
                            <div style={{fontSize:"12px"}} className="dropDownSection" ref={ulRef}>
                            <div className="CheckInCheckOut">
                                <div className="checkIn" onClick={openDropDown}>
                                    <p>CHECK-IN</p>  
                                    {selectedDateMonthYear(date[0].startDate)}</div>
                                <div className="checkOut" onClick={openDropDown}>  
                                <p>CHECK-OUT</p>
                                {date[0].endDate===null? `Continuous`: selectedDateMonthYear(date[0].endDate)}</div>
                            </div>
                                <div className={showDropDownName} >
                                   <h1>Choose a date</h1> 
                                    <DateRange
                                        minDate={new Date()}
                                        editableDateInputs={true}
                                        showSelectionPreview={true}
                                        onChange={item => setDate([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        months={2}
                                        calendarFocus="forward"
                                        direction="horizontal"
                                        ranges={date}
                                        preventSnapRefocus={true}
                                        disabledDates={spotBookingDate(spotBookingsArr)}
                                    />
                                </div>
                            </div>
                        <button onClick={handleReserve} className="reserve">{nightCounter(date[0].startDate, date[0].endDate)===0 ? `Check availability` : `Reserve` }</button>
                        <div className="FeeInfo">
                            {nightCounter(date[0].startDate, date[0].endDate) === 0
                            ? null
                            : (
                                <div>
                                    <div className="priceDetail">
                                        <p>${spot.price} x {nightCounter(date[0].startDate, date[0].endDate)} nights</p>
                                        <p>${spot.price * nightCounter(date[0].startDate, date[0].endDate)}</p>
                                    </div>
                                    <div className="priceDetail">
                                        <p>service fee</p>
                                        <p>$68</p>
                                    </div>
                                    <div className="totalPrice">
                                        <p>Total before taxes</p>
                                        <p>${spot.price * nightCounter(date[0].startDate, date[0].endDate)+68}</p>
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <h3>{nightCounter(date[0].startDate, date[0].endDate)===0 
                        ? (<div>
                            <h2>Select checkout date</h2>
                            <p>Add your travel dates for exact pricing</p>
                        </div>) 
                        :(
                            <div>
                                <h2>{nightCounter(date[0].startDate, date[0].endDate)} nights in {spot.city}</h2>
                                <p>{selectedDateMonthYear(date[0].startDate)} - {selectedDateMonthYear(date[0].endDate)}</p>
                            </div>
                        )}</h3>
                    </div>
                    <DateRange
                       minDate={new Date()}
                        editableDateInputs={true}
                        showSelectionPreview={true}
                        onChange={item => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        calendarFocus="forward"
                        direction="horizontal"
                        ranges={date}
                        preventSnapRefocus={true}
                        disabledDates={spotBookingDate(spotBookingsArr)}
                    />
                </div>

                <div className="reviews">
                    <div>
                        {spot.avgStarRating==='No reviews yet' ? 
                            <h4> New </h4> : (
                            <div className="priceReview">
                                <i className="fa-sharp fa-solid fa-star"></i>
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
                        <div key={review.id}>
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

            
            
            
        </div>
    )
    
}

export default SingleSpot;
{/* {date.length > 0 ? (
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
</div> */}