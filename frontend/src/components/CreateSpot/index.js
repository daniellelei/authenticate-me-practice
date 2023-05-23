import './CreateSpot.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {addSpotThunk} from '../../store/spots';
import * as spotsActions from '../../store/spots';
import { useHistory } from 'react-router-dom';
import Geocode from 'react-geocode'
import { getKey } from '../../store/maps';

const CreateSpot = () => {
    const key = useSelector((state) => state.maps.key);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [image5, setImage5] = useState('');
    const [errors, setErrors] = useState({});
    // const [lat, setLat] = useState(0);
    // const [lng, setLng] = useState(0);
    //const [showErrors, setShowErrors] = useState([])
    const [resErrors, setResErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!key) {
        dispatch(getKey());
        }
    }, [dispatch, key]);


    useEffect(()=>{
        const err = [];
        if(!address.length) err.address = 'Address is required'
        if(!city.length) err.city = 'City is required'
        if(!state.length) err.state = 'State is required'
        if(!country.length) err.country = 'Country is required'
        if(description.length < 30) err.description = 'Description needs a minimum of 30 characters'
        if(!name.length) err.name = 'Name is required'
        if(!price ||price<=0) err.price = 'Price is required and needs to be greater than 0'
        if(!image1.length) err.imageMin = 'Preview image is required'
        if(image1 &&!image1.includes('.png') && 
        !image1.includes('.jpg') && 
        !image1.includes('.jpeg')) err.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
        if(image2 && !image2.includes('.png') && 
        !image2.includes('.jpg') && 
        !image2.includes('.jpeg')) err.image2 ='Image URL must end in .png, .jpg, or .jpeg'
        if(image3 && !image3.includes('.png') && 
        !image3.includes('.jpg') && 
        !image3.includes('.jpeg')) err.image3 ='Image URL must end in .png, .jpg, or .jpeg'
        if(image4 &&!image4.includes('.png') && 
        !image4.includes('.jpg') && 
        !image4.includes('.jpeg')) err.image4 ='Image URL must end in .png, .jpg, or .jpeg'
        if(image5 &&!image5.includes('.png') && 
        !image5.includes('.jpg') && 
        !image5.includes('.jpeg')) err.image5 ='Image URL must end in .png, .jpg, or .jpeg'
        setErrors(err);
    },[address, city, state, country, name, description, price, image1, image2, image3, image4, image5])

    if (!key) {
        return null;
    }

    
    Geocode.setApiKey(key);
    Geocode.setLanguage("en");
    Geocode.setLocationType('ROOFTOP')
    Geocode.enableDebug();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await setHasSubmitted(true);
        await setResErrors({});
        
        
        
        
        if(!Boolean(Object.values(errors).length)){
            
            const longAddress = address.concat(", ", city).concat(", ", state)
            console.log('long Address', longAddress)
            const response = await Geocode.fromAddress(longAddress)
            let lat;
            let lng;
            if(response.status == 'OK') {
               lat = response.results[0].geometry.location.lat
               lng =response.results[0].geometry.location.lng
            }
            console.log('lat', lat)
            console.log('lng', lng)
            const newSpot = {
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
        
            let images = [];
            images.push(image1);
            if(image2) images.push(image2);
            if(image3) images.push(image3);
            if(image4) images.push(image4);
            if(image5) images.push(image5);
            const createdRes = await dispatch(addSpotThunk(newSpot,images))
            if(!createdRes.errors){
                history.push(`/spots/${createdRes.id}`)
                await reset()
            } else {
                await setResErrors(createdRes.errors);
            }
            }
        } 
    

    const reset = () => {
        setAddress('');
        setCity('');
        setState('');
        setCountry('');
        setName('');
        setDescription('');
        setPrice(0);
        setErrors([]);
        //setShowErrors([]);
        setResErrors({});
        setHasSubmitted(false);
    };

    return (
        <div className='createSpotPage'>
            <h1>Create a New Spot</h1>   
            <form onSubmit={handleSubmit} className='createForm'>
                <ul>
                    {/* {hasSubmitted ? 
                    errors.map((error, idx) => <li key={idx}>{error}</li>) :
                    null} */}
                    {hasSubmitted && Boolean(Object.values(resErrors).length) ? <li>{Object.values(resErrors)}</li> : null}
                </ul>
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
                        onChange={(e)=>setCountry(e.target.value)}
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
                        className='spotInputField'
                        type = 'text'
                        onChange={(e)=>setAddress(e.target.value)}
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
                            onChange={(e)=>setCity(e.target.value)}
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
                            onChange={(e)=>setState(e.target.value)}
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
                    onChange={(e) => setDescription(e.target.value)}
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
                    onChange={(e)=>setName(e.target.value)}
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
                        onChange={(e)=>setPrice(e.target.value)}
                        value = {price}
                        placeholder = 'Price per night (USD)'
                        name = 'price'
                        >
                        </input>
                    </div>
                    {hasSubmitted ? 
                        <p className='error'>{errors.price}</p> : null}
                </div>
                <div className='section'>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                    type = 'text'
                    className='spotInputField'
                    onChange={(e)=>setImage1(e.target.value)}
                    value={image1}
                    placeholder= 'Preview Image URL'
                    name = 'image1'
                    >
                    </input>
                    {hasSubmitted? 
                        <p className='error'>{errors.image1}</p> : null}
                    {hasSubmitted? 
                        <p className='error'>{errors.imageMin}</p> : null}    
                    {/* {showErrors.image1? <p className='error'>{showErrors.image1}</p> :null}
                    {showErrors.imageMin ? <p className='error'>{showErrors.imageMin}</p> : null} */}
                    <input
                    type = 'text'
                    className='spotInputField'
                    onChange={(e)=>setImage2(e.target.value)}
                    value={image2}
                    placeholder= 'Image URL'
                    name = 'image2'
                    >
                    </input>
                    {hasSubmitted? 
                        <p className='error'>{errors.image2}</p> : null}
                    <input
                    type = 'text'
                    className='spotInputField'
                    onChange={(e)=>setImage3(e.target.value)}
                    value={image3}
                    placeholder= 'Image URL'
                    name = 'image3'
                    >
                    </input>
                    {hasSubmitted? 
                        <p className='error'>{errors.image3}</p> : null}
                    <input
                    type = 'text'
                    className='spotInputField'
                    onChange={(e)=>setImage4(e.target.value)}
                    value={image4}
                    placeholder= 'Image URL'
                    name = 'image4'
                    >
                    </input>
                    {hasSubmitted? 
                        <p className='error'>{errors.image4}</p> : null}
                    <input
                    type = 'text'
                    className='spotInputField'
                    onChange={(e)=>setImage5(e.target.value)}
                    value={image5}
                    placeholder= 'Image URL'
                    name = 'image5'
                    >
                    </input>
                    {hasSubmitted? 
                        <p className='error'>{errors.image5}</p> : null}
                </div>
                <div className='submitDiv'>
                    <button type='submit'
                    className='createSubmit'
                    // disabled={Boolean(Object.values(errors).length)}
                    >Create Spot</button>
                </div>
                
            </form>
        </div>
    );
}

export default CreateSpot;