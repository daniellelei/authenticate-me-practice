import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import * as bookingsAction from '../../store/bookings'
import { useHistory } from "react-router-dom";

const DeleteBooking = ({booking, showDropDownDel, setShowDropDownDel}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state=>state.session.user);
    console.log('inside deletebooking', booking.id)

    const confirmDelete = async (e)=> {
        e.preventDefault();
        console.log('hit me')
        await dispatch(bookingsAction.thunkDeleteBooking(booking.id))
        await setShowDropDownDel(false);
        await dispatch(bookingsAction.thunkGetCurrentBookings());
        return history.push('/bookings/current');
    }

    return(
        <div>
            <h2>Are you sure to delete this booking?</h2>
            <button onClick={confirmDelete}>Delete</button>
        </div>
    )

}

export default DeleteBooking