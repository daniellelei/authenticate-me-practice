import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {useModal} from '../../context/Modal';
import * as ReviewActions from '../../store/reviews'
import  {loadReviewThunk}  from "../../store/reviews";
import { loadOneSpotThunk } from "../../store/spots";

const CreateReviewModal = ({spot}) => {
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const id = spot.id;

    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = {
            review,
            stars
        }
        await dispatch(ReviewActions.addReviewThunk(newReview, id))
        await closeModal();
        await reset();
        await dispatch(loadReviewThunk(id));
        await dispatch(loadOneSpotThunk(id))
    }

    const reset = () => {
        setReview('');
        setStars(0);
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>How is your staying?</label>
                <input
                type= 'text'
                onChange={(e)=>setReview(e.target.value)}
                value={review}
                name='review'
                ></input>
                <label> stars </label>
                <input
                type='text'
                onChange={(e)=>setStars(e.target.value)}
                value={stars}
                name='stars'
                >
                </input>
                <button
                type='submit'
                >Submit Review</button>
            </form>
        </div>
    )


}

export default CreateReviewModal;