import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {DateRange} from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as bookingsAction from '../../store/bookings'
import { useHistory } from "react-router-dom";
import './EditBooking.css'
const EditBooking = ({booking, showDropDownName}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spot = booking.Spot
    const user = useSelector(state=>state.session.user);
    const [resErrors, setResErrors] = useState({}); 
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(null)
    const [date, setDate] = useState([
        {
        startDate: startDate,
        endDate: endDate,
        key: 'selection'
        }
    ]);
    const spotBookings = useSelector(state=>state.bookings.spotBookings)
    useEffect(()=> {
        dispatch(bookingsAction.thunkGetSpotBookings(spot.id))
        return ()=>{
            dispatch(bookingsAction.actionClearSpotBookings())
        }
    },[showDropDownName])

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
            // console.log(`from editBooking blocked dates ${s.id}`,Dates)
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

    const handleUpdate = async (e) => {
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
        const bookingRes = await dispatch(bookingsAction.thunkEditBooking(booking.id, newBooking))
        if(!bookingRes.errors){
            history.push(`/bookings/current`)
        } else {
            await setResErrors(bookingRes.errors);
            console.log('resError', resErrors)
        }
    }


    return (
        <div className="editBooking">
            <div>
                <h3>Choose a date</h3> 
                <div className="editform">
                    <DateRange
                        minDate={new Date()}
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
                </div>
            </div>
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
                            <button onClick={handleUpdate}
                        >Update</button>
                    </div>
                )
                }
            </div>
        </div>
    )

}

export default EditBooking;