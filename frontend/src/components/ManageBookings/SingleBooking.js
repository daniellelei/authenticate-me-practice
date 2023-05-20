import * as bookingActions from '../../store/bookings'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import './ManageBooking.css'
import {DateRange} from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import EditBooking from '../EditBooking';
import DeleteBooking from '../DeleteBooking';

const SingleBooking = ({booking, bookingType}) => {
    const dispatch = useDispatch();
    const spot = booking.Spot
    
    const user = useSelector(state=>state.session.user)
    const ulRef = useRef();
    const ulRefDel = useRef();
    
    const [showDropDown, setShowDropDown] = useState(false);
    const [showDropDownDel, setShowDropDownDel] = useState(false);
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

    useEffect(()=> {
        if(!showDropDownDel) return;
        const closeMenu =(e)=> {
            if(!ulRefDel.current?.contains(e.target)) {
                setShowDropDownDel(false)
            }
        }
        document.addEventListener("click", closeMenu);
        return ()=>document.removeEventListener("click", closeMenu)
    }, [showDropDownDel])
    const showDropDownName = "dropdownEdit" + (showDropDown ? "" : " hidden");
    const showDropDownDelName = "dropdownDel" + (showDropDownDel ? "" : " hidden");

    const clickEdit = (e) => {
        e.preventDefault();
        if(showDropDown) return;
        setShowDropDown(true);
    }
    const closedEdit = (e) => {
        e.preventDefault();
        setShowDropDown(false);
    }
    const clickDelete = (e) => {
        e.preventDefault();
        if(showDropDownDel) return;
        setShowDropDownDel(true);

    }
    const closedDelete = (e) => {
        e.preventDefault();
        setShowDropDownDel(false)
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
                    <p>from {booking.startDate} to {booking.endDate}</p>
                </div>
                {bookingType==='past'? null : (
                <div>
                    <div className='bookingButtons' ref={ulRef}>
                        <button className='bookingButton'
                        onClick={clickEdit}
                        >Edit</button>
                        <div className={showDropDownName}>
                            <i className="fa-solid fa-xmark fa-xl"
                                    onClick={closedEdit}
                                    style={{transform:"translateX(760px)", cursor:'pointer'}}
                                    ></i>
                            <h2>{booking.Spot?.name}</h2>
                            <p>{booking.Spot?.city}, {booking.Spot?.state}</p>
                            <EditBooking booking={booking} showDropDown={showDropDown} setShowDropDown={setShowDropDown}/>
                            <button onClick={closedEdit}
                            className='createSpotbuttonm '
                            >Cancel</button>
                        </div>
                    </div>
                    <div className='bookingButtons' ref={ulRefDel}>
                        <button className='bookingButton'
                        onClick={clickDelete}
                        >Delete</button>
                        <div className={showDropDownDelName}>
                            {/* <h2>{booking.Spot?.name}</h2>
                            <p>{booking.Spot?.city}, {booking.Spot?.state}</p> */}
                            <DeleteBooking booking={booking} showDropDownDel={showDropDownDel} setShowDropDownDel={setShowDropDownDel}/>
                            <button onClick={closedDelete}
                            className='createSpotbuttonm '
                            style={{margin:"10px", padding:"10px 60px 10px 60px"}}
                            >Cancel</button>
                        </div>
                    </div>
                </div>

                )}

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