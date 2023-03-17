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
const DELETE_REVIEW = 'review/deleteReview';


//////////   Actions    /////////////////////
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
export const deleteReviewAction = (id) => {
    return{
        type: DELETE_REVIEW,
        id
    }
}
//////////   Thunks      ///////////////////////
export const loadReviewThunk = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${id}/reviews`)
    if(response.ok){
        const reviewRes = await response.json();
        let reviews = reviewRes.Reviews;
       
        //reviews = normalize(reviews)
        //console.log('loadReviewThunk', reviews);
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
        console.log('addReviewThunk', reviewRes);
        dispatch(addReviewAction(reviewRes));
    }
}
export const deleteReviewThunk = (id) => async (dispatch) => {
    const deleteRes = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE'
    })
    if(deleteRes.ok) {
        const deleteMessage = await deleteRes.json();
        dispatch(deleteReviewAction(id));
        return deleteMessage
    }
}


const initialState = { reviews: {}};

const reviewsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS:
            return {...state, reviews:{...action.reviews}}
        case ADD_REVIEW:
            // return {...state, 
            // reviews: {...action.reviews},
            //}
            return { ...state, [action.review.id]: action.review };
        case DELETE_REVIEW:
            const newState = {...state}
            delete newState.reviews[action.id];
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;