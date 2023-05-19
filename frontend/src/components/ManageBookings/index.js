import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, Link} from 'react-router-dom';
import * as bookingsAction from '../../store/bookings'
import SingleBooking from './SingleBooking';
import './ManageBooking.css'
const CurrentUserBookings = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const currentBookings = useSelector(state=>state.bookings.currentBookings)
    const user = useSelector(state=>state.session.user)

    useEffect(()=>{
        dispatch(bookingsAction.thunkGetCurrentBookings())

        return () => {
            dispatch(bookingsAction.actionClearCurrentBookings())
        }
    }, [dispatch])
    console.log(currentBookings)
    
    let currentBookingsArr = [];
    if(currentBookings) currentBookingsArr=Object.values(currentBookings)
    
    if (!currentBookingsArr.length){
        return (
            <div  className='manageBookingPage'>
                <h1>
                    Wanna add a booking?
                </h1>
                <h4>* Your booking history is empty</h4>
            </div>
        )
    }
    if (!currentBookings || !user) return (
        <div>Loading...</div>
    )
    return (
        
        <div className='manageBookingPage'>
            <h1>My Bookings</h1>
            <div>
                {
                    currentBookingsArr.map ((b)=>(
                        <div key={b.id}>
                            <SingleBooking booking={b} />
                        </div>
                    ))
                }
            </div>
        </div>
        
    )

}
export default CurrentUserBookings;