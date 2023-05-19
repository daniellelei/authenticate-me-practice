import * as bookingActions from '../../store/bookings'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";


const SingleBooking = ({booking}) => {
    const dispatch = useDispatch();
    const user = useSelector(state=>state.session.user)

    if (!booking || !user) return (
        <div>Loading...</div>
    )

    return (
        <div>
            <div>
                <div>
                    <h3>{booking.Spot.name}</h3>
                    <p>{booking.Spot.city}</p>
                    <p>{booking.Spot.state}</p>
                    <p>{booking.startDate} - {booking.endDate}</p>

                </div>
                <div>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>

            </div>
            <div>
                <img 
                    src={booking.Spot.previewImage}
                    alt = 'spotImage'
                />
            </div>
        </div>
    )
}

export default SingleBooking;