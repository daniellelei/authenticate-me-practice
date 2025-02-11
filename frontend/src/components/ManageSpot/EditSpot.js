import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { loadOneSpotThunk } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import { editSpotThunk } from '../../store/spots';
import Geocode from 'react-geocode'
import { getKey } from '../../store/maps';

const EditSpot = () => {
    const key = useSelector((state) => state.maps.key);
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const spot = useSelector(state => state.spots.singleSpot);
    
    
    
    
    useEffect(() => {
        dispatch(loadOneSpotThunk(spotId))
        if (!key) {
            dispatch(getKey());
        }
    }, [dispatch, key]);
    
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [resErrors, setResErrors] = useState({});
    //const [showErrors, setShowErrors] = useState({})
    

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
        if(!address?.length) err.address = 'Address is required'
        if(!city?.length) err.city = 'City is required'
        if(!state?.length) err.state = 'State is required'
        if(!country?.length) err.country = 'Country is required'
        if(description?.length < 30) err.description = 'Description needs a minimum of 30 characters'
        if(!name?.length) err.name = 'Name is required'
        if(!price || price <= 0) err.price = 'Price is required and needs to be greater than 0'
        
        setErrors(err);
    },[address, city, state, country, name, description, price])

    // useEffect(()=>{
    //     dispatch(loadOneSpotThunk(spotId));
    // }, [dispatch])
    if (!key ||!spot) {
        return null;
    }
    Geocode.setApiKey(key);
    Geocode.setLanguage("en");
    Geocode.setLocationType('ROOFTOP')
    Geocode.enableDebug();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setShowErrors(errors);
        // setErrors({});
        //console.log(errors);
        await setHasSubmitted(true);
        await setResErrors({});
        const longAddress = address.concat(", ", city).concat(", ", state)
        // console.log('long Address', longAddress)
        const response = await Geocode.fromAddress(longAddress)
        let lat;
        let lng;
        if(response.status == 'OK') {
            lat = response.results[0].geometry.location.lat
            lng =response.results[0].geometry.location.lng
        }

        
        
        if(!Boolean(Object.values(errors).length) && lat !== 0 && lng!==0) {
            const payload ={
            ...spot,
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat,
            lng
        };
            let updatedSpot = await dispatch(editSpotThunk(payload));
            if(!updatedSpot.errors) {
                history.push(`/spots/${updatedSpot.id}`)
                await setHasSubmitted(false);
            } else {
                await setResErrors(updatedSpot.errors);
            }

        }
    }

    if(!spot) return (
    <h1>No spots found</h1>);
 
    return (
        <div className='createSpotPage'>
            <h1>Update Spot</h1>   
            <form onSubmit={handleSubmit} className='createForm'>
                
                {/* <ul>
                    {hasSubmitted ? 
                    errors.map((error, idx) => <li key={idx}>{error}</li>) :
                    null}
                    {Boolean(Object.values(resErrors).length) ? <li>{Object.values(resErrors)}</li> : null}
                </ul> */}
                <div className='title'>
                </div>
                <div className='section'>
                    <h2>Where's your place located?</h2>
                    <p>* Guests will only get your exact address once they booked a reservation.</p>
                    <div className='eachInputDiv'>
                        <div className='labelError'>
                            <label>Country</label>
                            {hasSubmitted?
                            <p className='error'>{errors.country}</p> : null
                            }
                        </div>
                        <input
                        type = 'text'
                        className='spotInputField'
                        onChange={updateCountry}
                        value = {country}
                        placeholder = 'country'
                        name = 'country'
                    ></input>
                    </div>
                    <div className='eachInputDiv'>
                        <div className='labelError'>
                            <label>Street Address</label>
                            {hasSubmitted?
                            <p className='error'>{errors.address}</p> : null
                            }
                        </div>
                        <input
                        type = 'text'
                        className='spotInputField'
                        onChange={updateAddress}
                        value = {address}
                        placeholder = 'address'
                        name = 'address'
                        ></input>
                    </div>
                    <div className='cityState'>
                        <div className='eachInputDiv'>
                            <div className='labelError'>
                                <label className='cityLabel'>City</label>
                                {hasSubmitted? 
                                <p className='error'>{errors.city}</p> : null}
                                
                            </div>
                            <input
                            className='spotInputField cityinPut'
                            type = 'text'
                            onChange={updateCity}
                            value = {city}
                            placeholder = 'city'
                            name = 'city'
                            ></input>
                        </div>
                        <div className='eachInputDiv'>
                            <div className='labelError'>
                                <label className='cityLabel'>State</label>
                                {hasSubmitted? 
                                <p className='error'>{errors.state}</p> : null}
                            </div>
                            <input
                            type = 'text'
                            className='spotInputField stateinPut'
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
                    cols = '44'
                    onChange={updateDescription}
                    value = {description}
                    placeholder = 'Please write at least 30 characters'
                    name = 'description'
                    >
                    </textarea>
                    {hasSubmitted? 
                        <p className='error'>{errors.description}</p> : null}
                    
                </div>
                <div className='section'>
                    <div className='titleCaption'>
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    </div>
                    <input
                    type = 'text'
                    className='spotInputField'
                    onChange={updateName}
                    value = {name}
                    placeholder = 'Name of your spot'
                    name = 'name'
                    >
                    </input>
                    {hasSubmitted? 
                        <p className='error'>{errors.name}</p> : null}
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
                        className='spotInputField'
                        onChange={updatePrice}
                        value = {price}
                        placeholder = 'Price per night (USD)'
                        name = 'price'
                        >
                        </input>
                    </div>
                    {hasSubmitted ? 
                        <p className='error'>{errors.price}</p> : null}
                </div>
                <div className='submitDiv'>
                    <button type='submit'
                    className='createSubmit'
                    // disabled={Boolean(Object.values(errors).length)}
                    >Update Spot</button>
                </div>
                
            </form>
        </div>
    );
}

export default EditSpot; 