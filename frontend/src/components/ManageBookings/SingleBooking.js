import * as bookingActions from '../../store/bookings'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import './ManageBooking.css'

const SingleBooking = ({booking}) => {
    const dispatch = useDispatch();
    const user = useSelector(state=>state.session.user)

    if (!booking || !user) return (
        <div>Loading...</div>
    )

    return (
        <div className='singleBooking'>
            <div className='singleBookingLeft'>
                <div>
                    <h2>{booking.Spot.name}</h2>
                    <p>{booking.Spot.city}, {booking.Spot.state}</p>
                    <p>{booking.startDate} - {booking.endDate}</p>
                </div>
                <div className='bookingButtons'>
                    <button className='bookingButton'>Edit</button>
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