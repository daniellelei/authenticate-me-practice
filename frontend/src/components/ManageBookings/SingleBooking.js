import * as bookingActions from '../../store/bookings'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import './ManageBooking.css'
import {DateRange} from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import EditBooking from '../EditBooking';

const SingleBooking = ({booking}) => {
    const dispatch = useDispatch();
    const spot = booking.Spot
    
    const user = useSelector(state=>state.session.user)
    const ulRef = useRef();
    
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

    const showDropDownName = "dropdownEdit" + (showDropDown ? "" : " hidden");

    const clickEdit = (e) => {
        e.preventDefault();
        if(showDropDown) return;
        setShowDropDown(true);
    }
    const closedEdit = (e) => {
        e.preventDefault();
        setShowDropDown(false);
    }

    if (!booking || !user || !booking.Spot) return (
        <div>Loading...</div>
    )

    return (
        <div className='singleBooking'>
            <div className='singleBookingLeft'>
                <div>
                    <h2>{booking.Spot?.name}</h2>
                    <p>{booking.Spot?.city}, {booking.Spot?.state}</p>
                    <p>{booking.startDate} - {booking.endDate}</p>
                </div>
                <div className='bookingButtons' ref={ulRef}>
                    <button className='bookingButton'
                    onClick={clickEdit}
                    >Edit</button>
                    <div className={showDropDownName}>
                        <h2>{booking.Spot?.name}</h2>
                        <p>{booking.Spot?.city}, {booking.Spot?.state}</p>
                        <EditBooking booking={booking} showDropDown={showDropDown} setShowDropDown={setShowDropDown}/>
                        <button onClick={closedEdit}>Cancel</button>
                    </div>
                    <button className='bookingButton'>Delete</button>
                </div>

            </div>
            <div>
                <img 
                    className='bookingImage'
                    src={booking.Spot.previewImage}
                    alt = 'spotImage'
                />
            </div>
        </div>
    )
}

export default SingleBooking;