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
    const [price, setPrice] = useState(0);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(()=>{},[])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price,
        };

        let createdSpot = await dispatch(addSpotThunk(newSpot));
        console.log(createdSpot);
        if(createdSpot) {
            history.push(`/spots/${createdSpot.id}`)
            reset();
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
            <h1>Create a New Spot</h1>
            <form onSubmit={handleSubmit}>
                <div className='section1'>
                    <h2>Where's your place located?</h2>
                    <p>* Guests will only get your exact address once they booked a reservation.</p>
                    <div>
                        <label>Country</label>
                        <input
                        type = 'text'
                        onChange={(e)=>setCountry(e.target.value)}
                        value = {country}
                        placeholder = 'country'
                        name = 'country'
                    ></input>
                    </div>
                    <div>
                        <label>Street Address</label>
                        <input
                        type = 'text'
                        onChange={(e)=>setAddress(e.target.value)}
                        value = {address}
                        placeholder = 'address'
                        name = 'address'
                        ></input>
                    </div>
                    <div>
                        <div>
                            <label>City</label>
                            <input
                            type = 'text'
                            onChange={(e)=>setCity(e.target.value)}
                            value = {city}
                            placeholder = 'city'
                            name = 'city'
                            ></input>
                        </div>
                        <div>
                            <label>State</label>
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
                <div className='section2'>
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea
                    rows = '8'
                    cols = '50'
                    onChange={(e) => setDescription(e.target.value)}
                    value = {description}
                    placeholder = 'Please write at least 30 characters'
                    name = 'description'
                    >
                    </textarea>
                </div>
                <div className='section3'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                    type = 'text'
                    onChange={(e)=>setName(e.target.value)}
                    value = {name}
                    placeholder = 'Name of your spot'
                    name = 'name'
                    >
                    </input>
                </div>
                <div className='section4'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    $ <input
                    type = 'text'
                    onChange={(e)=>setPrice(e.target.value)}
                    value = {price}
                    placeholder = 'Price per night (USD)'
                    name = 'price'
                    >
                    </input>
                </div>
                <div className='section5'>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    {/* <input
                    type = 'text'
                    onChange={(e)=>{}}
                    >
                    </input> */}
                </div>
                <div>
                    <button type='submit'>Create Spot</button>
                </div>
                
            </form>
        </div>
    );
}

export default CreateSpot;