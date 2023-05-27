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
import * as spotsAction from "../../store/spots"
import { GoogleMap } from "@react-google-maps/api";
import MapContainer from '../Maps'
const SingleSpot = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate()+1)
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
    const [startDate, setStartDate] = useState(tomorrow)
    const [endDate, setEndDate] = useState(null)
    
    const [date, setDate] = useState([
        {
        startDate: startDate,
        endDate: endDate,
        key: 'selection'
        }
    ]);
    
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
            dispatch(spotsAction.clearSingleSpot())
        }
    }, [dispatch])
    if(!spot || !spot.SpotImages) return null;
    

    const imagesRender = (images) => {
        console.log('images', images)
        if(images){
            for (let i=0; i<images?.length; i++){
                images[i].ind = `img${i}`
            }
            return images;
        }
    }
    let images=[]
    if(spot){
        images = spot.SpotImages;
        images = imagesRender(images);
    }
    

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
            // let start = new Date(s.startDate)
            // let end = new Date(s.endDate)
            let start = new Date(Date.parse(s.startDate) + 86400000)
            let end = new Date(Date.parse(s.endDate) + 86400000)
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

    const checkOwner = (spot, user) => {
        if(spot?.ownerId === user?.id) return true
        return false
    }
    
    const loginButtonClassName = "loginButton" + (checkOwner(spot, user)) ? "" : " disable";



    
    
    return (
        <div className="wholePage">
            {/* <div className="sticky">I will stick to the screen when you reach my scroll position</div> */}
            <div className="singleSpot">
                <h1 className="spotName"
                >{spot.name}</h1>
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
                                    <i className="fa-solid fa-xmark fa-xl"
                                    onClick={(e)=> {
                                        e.preventDefault()
                                        setShowDropDown(false);
                                    }}
                                    style={{transform:"translateY(-15px)", cursor:'pointer'}}
                                    ></i>
                                   <h1>Choose a date</h1> 
                                    <DateRange
                                        minDate={tomorrow}
                                        editableDateInputs={true}
                                        rangeColors={["#D87093"]}
                                        showSelectionPreview={true}
                                        onChange={item => {
                                            console.log('onChange item', item)
                                            console.log('onChange [item.selection]', [item.selection])
                                            setDate([item.selection])
                                            setStartDate([item.selection][0].startDate)
                                            setEndDate([item.selection][0].endDate)
                                        }}
                                        moveRangeOnFirstSelection={false}
                                        months={2}
                                        calendarFocus="forward"
                                        direction="horizontal"
                                        ranges={date}
                                        preventSnapRefocus={true}
                                        disabledDates={spotBookingDate(spotBookingsArr)}
                                    />
                                    <button 
                                     className='createSpotbuttonm '
                                    onClick={(e)=> {
                                        e.preventDefault()
                                        setShowDropDown(false);
                                    }}
                                    >Select</button>
                                </div>
                            </div>
                            {checkOwner(spot, user)
                            ? (
                                <button className="reserve">Owner is not able to reserve</button>
                            ) 
                            : (
                                <button onClick={handleReserve} disabled={checkOwner(spot, user)} className="reserve">{nightCounter(date[0].startDate, date[0].endDate)===0 ? `Check availability` : `Reserve` }</button>
                            )}
                        
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
                    <div style={{zIndex:'-2',position:"relative"}}>
                        <DateRange
                        minDate={tomorrow}
                            editableDateInputs={true}
                            rangeColors={["#D87093"]}
                            showSelectionPreview={true}
                            onChange={item => {
                                setDate([item.selection])
                                setStartDate([item.selection][0].startDate)
                                setEndDate([item.selection][0].endDate)

                            }}
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
                    <div>
                        <h2>Where you'll be</h2>
                        <MapContainer spot={spot}/>
                    </div>
                    
                </div>
            </div>

            
            
            
        </div>
    )
    
}

export default SingleSpot;
