import React from 'react';
import * as ReviewActions from '../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { loadOneSpotThunk } from '../../store/spots';

function DeleteReviewModal (props) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const review = props.review
    //console.log('from delete modal review: ', review);
    const spotId = props.spotId
    //console.log('from delete modal spotId', spotId);

    const clickYes = async (e) => {
        e.preventDefault();
        await dispatch(ReviewActions.deleteReviewThunk(review.id))
        await closeModal();
        await dispatch(ReviewActions.loadReviewThunk(spotId));
        await dispatch(loadOneSpotThunk(spotId));
    }

    const clickNo = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <div>
            <h1>Confirm Delete</h1>
            <h4>Are you sure you want to delete this review?</h4>
            <div>
                <button onClick={clickYes}>Yes (Delete Review)</button>
                <button onClick={clickNo}>No (Keep Review)</button>
            </div>
        </div>
    )

}

export default DeleteReviewModal;