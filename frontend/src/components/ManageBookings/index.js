import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, Link} from 'react-router-dom';
import * as bookingsAction from '../../store/bookings'

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


    let currentBookingsArr = [];
    if(currentBookings) currentBookingsArr=Object.values(currentBookings)

    if (!currentBookings || !user) return (
        <div>Loading...</div>
    )
    return (
        <div>

            <div>
                <h1>My Bookings</h1>
                <div>
                    {
                        currentBookingsArr.map ((b)=>(
                            <div>
                                <p>Booking Id: {b.id}</p>
                                <p>{b.Spot.name}</p>
                                <p>Start Date: {b.startDate}</p>
                                <p>End Date: {b.endDate}</p>
                                <p>Created at: {b.createdAt}</p>
                                <p>Updated at: {b.updatedAt}</p>

                            </div>
                        ))
                    }

                </div>
            </div>

        </div>
    )

}
export default CurrentUserBookings;