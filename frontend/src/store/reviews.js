
export const normalize = (array) =>{
    const obj = {};
    array.forEach(o => {
        obj[o.id] = o
    });
    return obj;
}

const LOAD_REVIEWS = 'review/load';

export const loadReviewAction = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

export const loadReviewThunk = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${id}/reviews`)
    if(response.ok){
        const reviewRes = await response.json();
        let reviews = reviewRes.Reviews;
        reviews = normalize(reviews)
        dispatch(loadReviewAction(reviews));
        return reviews;
    }
}


const initialState = { reviews: null};

const reviewsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS:
            return {...state, reviews:{...action.reviews}}
        default:
            return state;
    }
}

export default reviewsReducer;