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
    const upcomingBooking = (currentBookingsArr) => {
        return currentBookingsArr.filter((c)=> Date.parse(c.endDate) + 86400000>= Date.parse(new Date()))
    }
    const pastBooking = (currentBookings) => {
        return currentBookingsArr.filter((c)=> Date.parse(c.endDate) + 86400000 < Date.parse(new Date()))
    }
    if (!currentBookings || !user) return (
        <div>Loading...</div>
    )
    return (
        
        <div className='manageBookingPage'>
            <h1 style={{marginBottom:"60px"}}>My Bookings</h1>
            <div>
                <h2 style={{borderBottom:"2px solid rgb(198, 198, 198)", padding:'15px'}}>Current and Upcoming Bookings</h2>
                {
                    upcomingBooking(currentBookingsArr).map((u)=> (
                        <div key={u.id}>
                            <SingleBooking booking={u} bookingType="upcoming"/>
                        </div>
                    ))
                }

            </div>
            <div>
                <h2 style={{borderBottom:"2px solid rgb(198, 198, 198)", padding:'15px'}}>Past Bookings</h2>
                {
                    pastBooking(currentBookingsArr).map ((b)=>(
                        <div key={b.id}>
                            <SingleBooking booking={b} bookingType='past'/>
                        </div>
                    ))
                }
            </div>
            
        </div>
        
    )

}
export default CurrentUserBookings;