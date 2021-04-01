import {ADD_PLACE, DELETE_PLACE, POPULATE_LIST, UPDATE_PLACE} from './touristPlaceTypes'

const initialState = {
    place_list: [],
    inputs: {},
    id: 0,
}

const touristPlaceReducer = (state = initialState, action) => {
    let new_list = [];
    switch(action.type) { 
        case ADD_PLACE: 
            new_list = state.place_list.concat(action.payload);
            return {
                ...state,
                place_list: new_list,
                id: state.id + 1
            }
        
        case DELETE_PLACE:
            new_list = state.place_list.filter(function(place) {
                return place.id !== parseInt(action.payload);
            });
            return {
                ...state,
                place_list: new_list
            }
        
        case POPULATE_LIST:
            return{
                ...state,
                place_list: action.payload
            }
        
        case UPDATE_PLACE:
            return {
                ...state,
                inputs: action.payload
            }
        default: return state;
    }
}

export default touristPlaceReducer;