


const LOAD_SPOTS = 'spots/loadSpots';

export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    };
}

const initialState = {allspots:[], isLoading: true};

const spotsReducer = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            return {...state, allspots: [...action.spots]};
        default:
            return state;
    }
}