import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { loadOneSpotThunk } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import { editSpotThunk } from '../../store/spots';

const EditSpot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const spot = useSelector(state => state.spots.singleSpot);

    useEffect(()=>{
        dispatch(loadOneSpotThunk(spotId))
    }, [dispatch])

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState({})

    useEffect(()=>{
        if(spot) {
            setAddress(spot.address);
            setCity(spot.city);
            setState(spot.state);
            setCountry(spot.country);
            setName(spot.name);
            setDescription(spot.description);
            setPrice(spot.price);
        }
    }, [spot])
    
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    

    useEffect(()=>{
        const err = {};
        if(!address.length) err.address = 'Address is required'
        if(!city.length) err.city = 'City is required'
        if(!state.length) err.state = 'State is required'
        if(!country.length) err.country = 'Country is required'
        if(description.length < 30) err.description = 'Description needs a minimum of 30 characters'
        if(!name.length) err.name = 'Name is required'
        if(!price) err.price = 'Price is required'
        
        setErrors(err);
    },[address, city, state, country, name, description, price])

    // useEffect(()=>{
    //     dispatch(loadOneSpotThunk(spotId));
    // }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowErrors(errors);
        setErrors({});

        const payload ={
            ...spot,
            address,
            city,
            state,
            country,
            name,
            description,
            price
        };

        let updatedSpot = await dispatch(editSpotThunk(payload));
        if(updatedSpot) {
            history.push(`/spots/${updatedSpot.id}`)
        }
    }

    if(!spot) return (
    <h1>No spots found</h1>);
 
    return (
        <div className='createSpotPage'>
            <form onSubmit={handleSubmit} className='createForm'>
                <div className='title'>
                <h1>Update Spot</h1>   
                </div>
                <div className='section'>
                    <h2>Where's your place located?</h2>
                    <p>* Guests will only get your exact address once they booked a reservation.</p>
                    <div>
                        <div className='labelError'>
                            <label>Country</label>
                            <p className='error'>{showErrors.country}</p>
                        </div>
                        <input
                        type = 'text'
                        onChange={updateCountry}
                        value = {country}
                        placeholder = 'country'
                        name = 'country'
                    ></input>
                    </div>
                    <div>
                        <div className='labelError'>
                            <label>Street Address</label>
                            <p className='error'>{showErrors.address}</p>
                        </div>
                        <input
                        type = 'text'
                        onChange={updateAddress}
                        value = {address}
                        placeholder = 'address'
                        name = 'address'
                        ></input>
                    </div>
                    <div className='cityState'>
                        <div className='city'>
                            <div className='labelError'>
                                <label>City</label>
                                <p className='error'>{showErrors.city}</p>
                            </div>
                            <input
                            type = 'text'
                            onChange={updateCity}
                            value = {city}
                            placeholder = 'city'
                            name = 'city'
                            ></input>
                        </div>
                        <div className='city'>
                            <div className='labelError'>
                                <label>State</label>
                                <p className='error'>{showErrors.state}</p>
                            </div>
                            <input
                            type = 'text'
                            onChange={updateState}
                            value = {state}
                            placeholder = 'state'
                            name = 'state'
                            ></input>
                        </div> 
                    </div>
                </div>
                <div className='section'>
                    <div className='titleCaption'>
                        <h2>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    </div>
                    <textarea
                    rows = '8'
                    cols = '50'
                    onChange={updateDescription}
                    value = {description}
                    placeholder = 'Please write at least 30 characters'
                    name = 'description'
                    >
                    </textarea>
                    <p className='error'>{showErrors.description}</p>
                </div>
                <div className='section'>
                    <div className='titleCaption'>
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    </div>
                    <input
                    type = 'text'
                    onChange={updateName}
                    value = {name}
                    placeholder = 'Name of your spot'
                    name = 'name'
                    >
                    </input>
                </div>
                <div className='section'>
                    <div className='titleCaption'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    </div>
                    <div className='dollorSign'>
                        <p>$ </p>
                        <input
                        type = 'text'
                        onChange={updatePrice}
                        value = {price}
                        placeholder = 'Price per night (USD)'
                        name = 'price'
                        >
                        </input>
                    </div>
                    <p className='error'>{showErrors.price}</p>
                </div>
                <div>
                    <button type='submit'
                    // disabled={Boolean(Object.values(errors).length)}
                    >Update Spot</button>
                </div>
                
            </form>
        </div>
    );
}

export default EditSpot; 