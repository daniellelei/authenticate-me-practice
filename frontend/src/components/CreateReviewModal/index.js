import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {useModal} from '../../context/Modal';
import * as ReviewActions from '../../store/reviews'
import  {loadReviewThunk}  from "../../store/reviews";
import { loadOneSpotThunk } from "../../store/spots";
import StarsRatingInput from "./StarsRatingInput";
import './reviewModal.css'
const CreateReviewModal = ({spot}) => {
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});
    const [errorRes, setErrorRes] = useState({});
    const id = spot.id;

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect (()=>{
        const err = {};
        if(review.length < 10) err.review = 'review needs to be at least 10 characters long.'
        if(stars<1) err.star = 'Lowest rating is 1 star'
        setErrors(err);
    },[review, stars])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const newReview = {
            review,
            stars
        }
        const addReviewRes = await dispatch(ReviewActions.addReviewThunk(newReview, id))
        //const addReviewData = await addReviewRes.json();
        if(addReviewRes.message){
            //console.log(addReviewRes.message)
            await setErrorRes(addReviewRes)
        }
        await closeModal();
        await reset();
        await dispatch(loadReviewThunk(id));
        await dispatch(loadOneSpotThunk(id))
    }

    const reset = () => {
        setReview('');
        setStars(0);
        setErrorRes({});
        setErrors({});
    }

    const onChange = (stars) => {
        setStars(parseInt(stars));
    };

    const loginButtonClassName = "loginButton" + (!Boolean(Object.values(errors).length) ? "" : " disable");
    return (
        <div className="reviewModal">
            <form onSubmit={handleSubmit}>
                <label className="reviewPrompt">How was your stay?</label>
                {Boolean(Object.values(errorRes).length) ? 
                <p className="error">{errorRes}</p> : null
                }
                <textarea
                cols='30'
                rows='5'
                placeholder="Leave your review here..."
                onChange={(e)=>setReview(e.target.value)}
                value={review}
                name='review'
                ></textarea>
                <div className="starsInput">
                    <StarsRatingInput disabled={false} onChange={onChange} rating={stars} />
                    <h4>stars</h4>
                </div>
                <div className='submitDiv'>
                    <button
                    type='submit'
                    className={loginButtonClassName}
                    disabled={Boolean(Object.values(errors).length)}
                    >Submit Your Review</button>
                </div>
            </form>
        </div>
    )


}

export default CreateReviewModal;