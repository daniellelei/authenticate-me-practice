import './CreateSpot.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {addSpotThunk} from '../../store/spots';
import { useHistory } from 'react-router-dom';
const CreateSpot = () => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    // const updateImages = (e) => {
    //     setImages((images)=>images.push(e.target.value))
    // }

    useEffect(()=>{
        const err = {};
        if(!address.length) err.address = 'Address is required'
        if(!city.length) err.city = 'City is required'
        if(!state.length) err.state = 'State is required'
        if(!country.length) err.country = 'Country is required'
        if(description.length < 30) err.description = 'Description needs a minimum of 30 characters'
        if(!name.length) err.name = 'Name is required'
        if(!price) err.price = 'Price is required'
        if(!images.length) err.image = 'Preview image is required'
        // for(let i = 0; i < images.length; i++ ){
        //     if(!images[i].includes('.png') && !images[i].includes('.jpg') && !images[i].includes('.jpeg')) {
        //         err.image = 'Image URL must end in .png, .jpg, or .jpeg'
        //     }
        // }
        setErrors(err);
    },[address, city, state, country, name, description, price, images])

    const addImage = (e) => {

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        const newSpot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price,
        };

        

        let createdSpot = await dispatch(addSpotThunk(newSpot,images));
        console.log(createdSpot);
        if(createdSpot) {
            history.push(`/spots/${createdSpot.id}`)
            reset();
            setHasSubmitted(false);
        }
    };

    const reset = () => {
        setAddress('');
        setCity('');
        setState('');
        setCountry('');
        setName('');
        setDescription('');
        setPrice(0);
    };

    return (
        <div className='createSpotPage'>
            <form onSubmit={handleSubmit}>
                <div className='title'>
                <h1>Create a New Spot</h1>   
                </div>
                <div className='section'>
                    <h2>Where's your place located?</h2>
                    <p>* Guests will only get your exact address once they booked a reservation.</p>
                    <div>
                        <div className='labelError'>
                            <label>Country</label>
                            <p className='error'>{errors.country}</p>
                        </div>
                        <input
                        type = 'text'
                        onChange={(e)=>setCountry(e.target.value)}
                        value = {country}
                        placeholder = 'country'
                        name = 'country'
                    ></input>
                    </div>
                    <div>
                        <div className='labelError'>
                            <label>Street Address</label>
                            <p className='error'>{errors.address}</p>
                        </div>
                        <input
                        type = 'text'
                        onChange={(e)=>setAddress(e.target.value)}
                        value = {address}
                        placeholder = 'address'
                        name = 'address'
                        ></input>
                    </div>
                    <div className='cityState'>
                        <div className='city'>
                            <div className='labelError'>
                                <label>City</label>
                                <p className='error'>{errors.city}</p>
                            </div>
                            <input
                            type = 'text'
                            onChange={(e)=>setCity(e.target.value)}
                            value = {city}
                            placeholder = 'city'
                            name = 'city'
                            ></input>
                        </div>
                        <div className='city'>
                            <div className='labelError'>
                                <label>State</label>
                                <p className='error'>{errors.state}</p>
                            </div>
                            <input
                            type = 'text'
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
                    cols = '50'
                    onChange={(e) => setDescription(e.target.value)}
                    value = {description}
                    placeholder = 'Please write at least 30 characters'
                    name = 'description'
                    >
                    </textarea>
                    <p className='error'>{errors.description}</p>
                </div>
                <div className='section'>
                    <div className='titleCaption'>
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    </div>
                    <input
                    type = 'text'
                    onChange={(e)=>setName(e.target.value)}
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
                        onChange={(e)=>setPrice(e.target.value)}
                        value = {price}
                        placeholder = 'Price per night (USD)'
                        name = 'price'
                        >
                        </input>
                    </div>
                    <p className='error'>{errors.price}</p>
                </div>
                <div className='section'>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                    type = 'text'
                    onChange={(e)=>setImages([...images, e.target.value])}
                    value={images[0]}
                    placeholder= 'Preview Image URL'
                    name = 'image0'
                    >
                    </input>
                    <p className='error'>{errors.image}</p>
                    <input
                    type = 'text'
                    onChange={(e)=>setImages([...images, e.target.value])}
                    value={images[1]}
                    placeholder= 'Image URL'
                    name = 'image1'
                    >
                    </input>
                    <p className='error'>{errors.image}</p>
                    <input
                    type = 'text'
                    onChange={(e)=>setImages([...images, e.target.value])}
                    value={images[2]}
                    placeholder= 'Image URL'
                    name = 'image2'
                    >
                    </input>
                    <p className='error'>{errors.image}</p>
                    <input
                    type = 'text'
                    onChange={(e)=>setImages([...images, e.target.value])}
                    value={images[3]}
                    placeholder= 'Image URL'
                    name = 'image3'
                    >
                    </input>
                    <p className='error'>{errors.image}</p>
                    <input
                    type = 'text'
                    onChange={(e)=>setImages([...images, e.target.value])}
                    value={images[4]}
                    placeholder= 'Image URL'
                    name = 'image4'
                    >
                    </input>
                    <p className='error'>{errors.image}</p>
                </div>
                <div>
                    <button type='submit'
                    disabled={Boolean(Object.values(errors).length)}
                    >Create Spot</button>
                </div>
                
            </form>
        </div>
    );
}

export default CreateSpot;