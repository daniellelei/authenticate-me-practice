import './CreateSpot.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {addSpotThunk} from '../../store/spots';
import * as spotsActions from '../../store/spots';
import { useHistory } from 'react-router-dom';
const CreateSpot = () => {
    
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
    const [errors, setErrors] = useState([]);
    //const [showErrors, setShowErrors] = useState([])
    const [resErrors, setResErrors] = useState({});
    const [hasSubmited, setHasSubmitted] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(()=>{
        const err = [];
        if(!address.length) err.push  ('Address is required')
        if(!city.length) err.push  ('City is required')
        if(!state.length) err.push  ('State is required')
        if(!country.length) err.push  ('Country is required')
        if(description.length < 30) err.push ( 'Description needs a minimum of 30 characters')
        if(!name.length) err.push  ('Name is required')
        if(!price) err.push  ('Price is required')
        if(!image1.length) err.push  ('Preview image is required')
        if(image1 &&!image1.includes('.png') && 
        !image1.includes('.jpg') && 
        !image1.includes('.jpeg')) err.push ('Image URL must end in .png, .jpg, or .jpeg')
        if(image2 && !image2.includes('.png') && 
        !image2.includes('.jpg') && 
        !image2.includes('.jpeg')) err.push  ('Image URL must end in .png, .jpg, or .jpeg')
        if(image3 && !image3.includes('.png') && 
        !image3.includes('.jpg') && 
        !image3.includes('.jpeg')) err.push  ('Image URL must end in .png, .jpg, or .jpeg')
        if(image4 &&!image4.includes('.png') && 
        !image4.includes('.jpg') && 
        !image4.includes('.jpeg')) err.push  ('Image URL must end in .png, .jpg, or .jpeg')
        if(image5 &&!image5.includes('.png') && 
        !image5.includes('.jpg') && 
        !image5.includes('.jpeg')) err.push  ('Image URL must end in .png, .jpg, or .jpeg')
        setErrors(err);
    },[address, city, state, country, name, description, price, image1, image2, image3, image4, image5])
    const clickSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('errors', errors)
        //setShowErrors(errors);
        //setErrors([]);
        console.log('after showError', errors);
        //console.log('showError', showErrors)
        setResErrors({});
        const newSpot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price,
        };
        if(!errors.length){
            let images = [];
            images.push(image1);
            if(image2) images.push(image2);
            if(image3) images.push(image3);
            if(image4) images.push(image4);
            if(image5) images.push(image5);
            dispatch(addSpotThunk(newSpot,images))
            .catch (async (res) => {
                const data = await res.json();
                console.log('inside catch', data)
                if(data && data.errors) {
                    setResErrors(data.errors);
                    setHasSubmitted(false);
                } else if(data){
                    history.push(`/spots/${data.id}`)
                    reset();
                }
            })
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
            <form onSubmit={handleSubmit} className='createForm'>
                <ul>
                    {hasSubmited ? 
                    errors.map((error, idx) => <li key={idx}>{error}</li>) :
                    null}
                    {Boolean(Object.values(resErrors).length) ? <li>{Object.values(resErrors)}</li> : null}
                </ul>
                <div className='title'>
                <h1>Create a New Spot</h1>   
                </div>
                <div className='section'>
                    <h2>Where's your place located?</h2>
                    <p>* Guests will only get your exact address once they booked a reservation.</p>
                    <div>
                        <div className='labelError'>
                            <label>Country</label>
                            {/* <p className='error'>{showErrors.country}</p> */}
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
                            {/* <p className='error'>{showErrors.address}</p> */}
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
                                {/* <p className='error'>{showErrors.city}</p> */}
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
                                {/* <p className='error'>{showErrors.state}</p> */}
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
                    {/* <p className='error'>{showErrors.description}</p> */}
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
                    {/* <p className='error'>{showErrors.price}</p> */}
                </div>
                <div className='section'>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                    type = 'text'
                    onChange={(e)=>setImage1(e.target.value)}
                    value={image1}
                    placeholder= 'Preview Image URL'
                    name = 'image1'
                    >
                    </input>
                    {/* {showErrors.image1? <p className='error'>{showErrors.image1}</p> :null}
                    {showErrors.imageMin ? <p className='error'>{showErrors.imageMin}</p> : null} */}
                    <input
                    type = 'text'
                    onChange={(e)=>setImage2(e.target.value)}
                    value={image2}
                    placeholder= 'Image URL'
                    name = 'image2'
                    >
                    </input>
                    {/* <p className='error'>{showErrors.image2}</p> */}
                    <input
                    type = 'text'
                    onChange={(e)=>setImage3(e.target.value)}
                    value={image3}
                    placeholder= 'Image URL'
                    name = 'image3'
                    >
                    </input>
                    {/* <p className='error'>{showErrors.image3}</p> */}
                    <input
                    type = 'text'
                    onChange={(e)=>setImage4(e.target.value)}
                    value={image4}
                    placeholder= 'Image URL'
                    name = 'image4'
                    >
                    </input>
                    {/* <p className='error'>{showErrors.image4}</p> */}
                    <input
                    type = 'text'
                    onChange={(e)=>setImage5(e.target.value)}
                    value={image5}
                    placeholder= 'Image URL'
                    name = 'image5'
                    >
                    </input>
                    {/* <p className='error'>{showErrors.image5}</p> */}
                </div>
                <div>
                    <button type='submit'
                    onClick={clickSubmit}
                    // disabled={Boolean(Object.values(errors).length)}
                    >Create Spot</button>
                </div>
                
            </form>
        </div>
    );
}

export default CreateSpot;