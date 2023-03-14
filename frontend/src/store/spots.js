import {csrfFetch} from './csrf';
import Cookies from 'js-cookie';

const LOAD_ALL_SPOTS = 'spots/loadAllSpots';
const LOAD_ONE_SPOT = 'spots/loadOneSpot';
const ADD_SPOT = 'spots/AddSpot';

export const loadSpots = (allSpots) => {
    return {
        type: LOAD_ALL_SPOTS,
        allSpots
    };
}

export const loadOneSpot = (singleSpot) => {
    return {
        type: LOAD_ONE_SPOT,
        singleSpot
    }
}

export const addSpot = (singleSpot) => {
    return {
        type: ADD_SPOT,
        singleSpot
    }
}

export const loadAllSpots = (payload) => async (dispatch) => {
    const response = await fetch('/api/spots');
    if(response.ok) {
        const spotsRes = await response.json();
        const Spots = spotsRes.Spots;
        dispatch(loadSpots(Spots));
        return Spots;
    }
}

export const loadOneSpotThunk = (spotId) => async (dispatch) => {
    
    const response = await fetch(`/api/spots/${spotId}`);
    if(response.ok) {
        const spotRes = await response.json();
        console.log(spotRes);
        dispatch(loadOneSpot(spotRes));
        return spotRes;
    }
}
export const addSpotThunk = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        header: {'Content-Type' : 'application/json'},
        body: JSON.stringify(spot)
    })

    if(response.ok) {
        const spot = await response.json();
        dispatch(addSpot(spot));
        return spot
    }
}

const initialState = { spots: {}, isLoading: true};

const spotsReducer = (state = initialState.spots, action) => {
    switch (action.type) {
        case LOAD_ALL_SPOTS:
            return {...state, allSpots: [...action.allSpots]};
        case LOAD_ONE_SPOT:
            return {...state, singleSpot: action.singleSpot};
        case ADD_SPOT:
            return {...state, allSpots: [...state.allSpots, action.singleSpot]};
        default:
            return state;
    }
}

export default spotsReducer;