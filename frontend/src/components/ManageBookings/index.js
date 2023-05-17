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

        // return () => {
        //     dispatch(bookingsAction.action)
        // }
    }, [dispatch])
    return ()

}
export default CurrentUserBookings;