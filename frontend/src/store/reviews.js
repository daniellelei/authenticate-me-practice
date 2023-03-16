import { csrfFetch } from "./csrf";

export const normalize = (array) =>{
    const obj = {};
    array.forEach(o => {
        obj[o.id] = o
    });
    return obj;
}

const LOAD_REVIEWS = 'review/load';
const ADD_REVIEW = 'review/addReview';

export const loadReviewAction = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}
export const addReviewAction = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

export const loadReviewThunk = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${id}/reviews`)
    if(response.ok){
        const reviewRes = await response.json();
        let reviews = reviewRes.Reviews;
        console.log('load review before normalize', reviews);
        reviews = normalize(reviews)
        console.log('load review after normalize', reviews);
        dispatch(loadReviewAction(reviews));
        return reviews;
    }
}
export const addReviewThunk = (review, id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`, {
        method: 'POST',
        header: {'Content-Type' : 'application/json'},
        body: JSON.stringify(review)
    })
    if(response.ok) {
        const reviewRes = await response.json();
        dispatch(addReviewAction(reviewRes))
        const newReviewsRes = await fetch(`/api/spots/${reviewRes.spotId}/reviews`)
        let newReview = await newReviewsRes.json();
        console.log('newReview before normalizae', newReview)
        // newReview = normalize(newReview);
        // console.log('newReview', newReview)
        //dispatch(loadReviewAction(newReview));

        return newReview;
    }
}


const initialState = { reviews: {}};

const reviewsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS:
            console.log('load Review action',action)
            return {...state, reviews:{...action.reviews}}
        case ADD_REVIEW:
            console.log('action',action)
            // return {...state, 
            // reviews: {...action.review},
            let newState={...state};
            console.log('before new data', newState)
            newState.reviews[action.review.id]=action.review
            console.log('after key into id', newState)
            return newState;
        
        default:
            return state;
    }
}

export default reviewsReducer;