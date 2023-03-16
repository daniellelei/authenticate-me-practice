import {csrfFetch} from './csrf';
import Cookies from 'js-cookie';

export const normalize = (array) =>{
    const obj = {};
    array.forEach(o => {
        obj[o.id] = o;
    })
    return obj;
}

const LOAD_ALL_SPOTS = 'spots/loadAllSpots';
const LOAD_ONE_SPOT = 'spots/loadOneSpot';
const ADD_SPOT = 'spots/AddSpot';
const DELETE_SPOT = 'spots/deleteSpot';
const LOAD_CURRENT_SPOTS = 'spots/loadCurrentSpots'

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

export const loadCurrentSpots = (current) => {
    return {
        type: LOAD_CURRENT_SPOTS,
        current
    }
}

export const addSpot = (singleSpot) => {
    return {
        type: ADD_SPOT,
        singleSpot
    }
}

export const deleteSpot = (id) => {
    return {
        type: DELETE_SPOT,
        id
    }
}

export const loadAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    if(response.ok) {
        const spotsRes = await response.json();
        let Spots = spotsRes.Spots; //array
        Spots = normalize(Spots)
        dispatch(loadSpots(Spots));
        return Spots;
    }
}

export const loadOneSpotThunk = (spotId) => async (dispatch) => {
    
    const response = await fetch(`/api/spots/${spotId}`);
    if(response.ok) {
        const spotRes = await response.json();
        //console.log(spotRes);
        dispatch(loadOneSpot(spotRes));
        return spotRes;
    }
}
export const addSpotThunk = (spot, images) => async (dispatch) => {
    //post a spot
    const response1 = await csrfFetch(`/api/spots`, {
        method: 'POST',
        header: {'Content-Type' : 'application/json'},
        body: JSON.stringify(spot)
    })
    const spotRes = await response1.json();
    //console.log(spotRes.id);
    //post an image
    for(let i of images){
        let imgObj = {
            url:i,
            preview:true
        }
        await csrfFetch(`/api/spots/${spotRes.id}/images`,{
        method: 'POST',
        header: {'Content-Type' : 'application/json'},
        body:JSON.stringify(imgObj)
    })
    }
    const newSpotRes = await csrfFetch(`/api/spots/${spotRes.id}`);
    const newSpot = await newSpotRes.json();
    dispatch(addSpot(newSpot));
    return newSpot;

}
//Get all Spots owned by the Current User
export const loadSpotsCurrentThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    if(response.ok) {
        const spotsRes = await response.json();
        let Spots = spotsRes.Spots;
        console.log('from thunk', Spots)
        if(Spots){
            Spots = normalize(Spots)
            dispatch(loadCurrentSpots(Spots));
        }
        return Spots;
    }
}

//Edit spot thunk
export const editSpotThunk = (payload) => async (dispatch) => {
    const editResponse = await csrfFetch(`/api/spots/${payload.id}`, {
        method: 'PUT',
        header: {'Content-Type' : 'application/json'},
        body: JSON.stringify(payload)
    })

    if(editResponse.ok) {
        const updatedSpotRes = await csrfFetch(`/api/spots/${payload.id}`)
        const updatedSpot = await updatedSpotRes.json()
        dispatch(loadOneSpot(updatedSpot));
        return updatedSpot;
    }
}

//delete spot thunk
export const deleteSpotThunk = (id) => async (dispatch) => {
    const deleteResponse = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE'
    })
    if(deleteResponse.ok) {
        const deleteMessage = await deleteResponse.json()
        dispatch(deleteSpot(id));
        return deleteMessage;
    }
}

const initialState = { spots: {}, isLoading: true};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_SPOTS:
            return {...state, allSpots: {...action.allSpots}};
        case LOAD_ONE_SPOT:
            return {...state, singleSpot: action.singleSpot};
        case LOAD_CURRENT_SPOTS:
            return {currentSpots: {...action.current}}
        case ADD_SPOT:
            return {
                ...state, 
                singleSpot: action.singleSpot,
                allSpots: action.singleSpot,
            };
        case DELETE_SPOT:
            const newState = {...state, allSpots: {...action.allSpots}, currentSpots: {...action.currentSpots}}
            delete newState.allSpots[action.id]
            delete newState.currentSpots[action.id]
            return newState;
        default:
            return state;
    }
}

export default spotsReducer;